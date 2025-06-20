import os
import psycopg2
from psycopg2.extras import DictCursor
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from decimal import Decimal, InvalidOperation
from datetime import datetime

# --- ログイン機能のためのライブラリをインポート ---
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_default_secret_key_for_dev')

# --- ログイン機能のための設定 (変更なし) ---
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = "このページにアクセスするにはログインが必要です。"

class User(UserMixin):
    def __init__(self, id):
        self.id = id

users = {'1': User('1')}

@login_manager.user_loader
def load_user(user_id):
    return users.get(user_id)

class LoginForm(FlaskForm):
    password = PasswordField('パスワード', validators=[DataRequired()])
    submit = SubmitField('ログイン')


# --- データベース接続 (変更なし) ---
DATABASE_URL = os.environ.get('POSTGRES_URL_NON_POOLING')

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=DictCursor)
    return conn
    
INITIAL_BUDGET = Decimal('50000')

# --- ルート(URL)の定義 ---

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        if form.password.data == 'your_secret_password': # ご自身のパスワードに変更してください
            user = users['1']
            login_user(user)
            # ★追加：ログイン成功時にゲストデータを削除
            session.pop('guest_transactions', None)
            return redirect(url_for('index'))
        else:
            flash('パスワードが正しくありません。')
    return render_template('login.html', form=form)

@app.route('/logout')
def logout():
    logout_user()
    # ★追加：ログアウト時にゲストデータを削除
    session.pop('guest_transactions', None)
    return redirect(url_for('login'))


@app.route('/')
def index():
    total_income = Decimal(0)
    total_expense = Decimal(0)

    if current_user.is_authenticated:
        # --- ログインしているユーザーの処理 ---
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute('SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = %s', ('income',))
        total_income = cur.fetchone()[0]

        cur.execute('SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = %s', ('expense',))
        total_expense = cur.fetchone()[0]
        
        cur.close()
        conn.close()
    else:
        # --- ゲストの処理 ---
        guest_transactions = session.get('guest_transactions', [])
        for t in guest_transactions:
            if t['type'] == 'income':
                total_income += Decimal(t['amount'])
            else:
                total_expense += Decimal(t['amount'])

    remaining_budget = INITIAL_BUDGET + total_income - total_expense

    return render_template('index.html', 
                           initial_budget=f'{INITIAL_BUDGET:,.0f}',
                           total_income=f'{total_income:,.0f}',
                           total_expense=f'{total_expense:,.0f}',
                           remaining_budget=f'{remaining_budget:,.0f}')

@app.route('/add', methods=['POST'])
# ★変更：ログイン必須を外す
def add_transaction():
    trans_type = request.form.get('type')
    category = request.form.get('category')
    amount_str = request.form.get('amount')
    
    # ... (バリデーション部分は変更なし)
    if not all([trans_type, category, amount_str]):
        return jsonify({'success': False, 'message': 'エラー: すべての項目を入力してください。'})
    try:
        amount = Decimal(amount_str)
        if amount <= 0: raise ValueError()
    except (InvalidOperation, ValueError):
        return jsonify({'success': False, 'message': 'エラー: 金額は正しい数値で入力してください。'})

    if current_user.is_authenticated:
        # --- ログインしているユーザーの処理 ---
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO transactions (type, category, amount) VALUES (%s, %s, %s)',
                     (trans_type, category, amount))
        conn.commit()
        # 合計を再計算
        cur.execute('SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = %s', ('income',))
        total_income = cur.fetchone()[0]
        cur.execute('SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = %s', ('expense',))
        total_expense = cur.fetchone()[0]
        cur.close()
        conn.close()
    else:
        # --- ゲストの処理 ---
        if 'guest_transactions' not in session:
            session['guest_transactions'] = []
        
        # ゲストのセッションに取引データを追加
        session['guest_transactions'].append({
            'type': trans_type,
            'category': category,
            'amount': str(amount), # セッションにはDecimalを直接入れない方が安全
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
        session.modified = True # セッションが変更されたことを明示
        
        # 合計を再計算
        total_income = Decimal(0)
        total_expense = Decimal(0)
        for t in session['guest_transactions']:
            if t['type'] == 'income':
                total_income += Decimal(t['amount'])
            else:
                total_expense += Decimal(t['amount'])

    remaining_budget = INITIAL_BUDGET + total_income - total_expense

    return jsonify({
        'success': True,
        'message': '✓ 取引を追加しました。',
        'total_income': f'{total_income:,.0f}',
        'total_expense': f'{total_expense:,.0f}',
        'remaining_budget': f'{remaining_budget:,.0f}'
    })

@app.route('/history')
# ★変更：ログイン必須を外す
def history():
    transactions = []
    if current_user.is_authenticated:
        # --- ログインしているユーザーの処理 ---
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM transactions ORDER BY date DESC')
        transactions = cur.fetchall()
        cur.close()
        conn.close()
    else:
        # --- ゲストの処理 ---
        # セッションからデータを取得し、新しいものが上に来るように逆順にする
        transactions = sorted(session.get('guest_transactions', []), key=lambda x: x['date'], reverse=True)

    return render_template('history.html', transactions=transactions)
  
