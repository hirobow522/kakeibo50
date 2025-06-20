import os
import psycopg2
from psycopg2.extras import DictCursor
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from decimal import Decimal, InvalidOperation

# --- ログイン機能のためのライブラリをインポート ---
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user

app = Flask(__name__)
# Flask-WTF と Flask-Login のためにSECRET_KEYが必須
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_default_secret_key_for_dev')

# --- ログイン機能のための設定 ---
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login' # 未ログイン時にリダイレクトする先
login_manager.login_message = "このページにアクセスするにはログインが必要です。"

# --- ユーザーモデルの定義 (今回はシンプルに一つだけのユーザー) ---
class User(UserMixin):
    def __init__(self, id):
        self.id = id

# 仮のユーザーデータ (本来はデータベースで管理)
# 今回はID '1' のユーザーしかいないという想定
users = {'1': User('1')}

@login_manager.user_loader
def load_user(user_id):
    return users.get(user_id)

# --- ログインフォームの定義 ---
class LoginForm(FlaskForm):
    # 今回はユーザー名は不要なのでパスワードのみ
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
        # --- ここでパスワードをチェック ---
        # 重要：このパスワードを、ご自身で決めた安全なものに変更してください
        if form.password.data == 'your_secret_password':
            user = users['1']
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash('パスワードが正しくありません。')
    return render_template('login.html', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/')
@login_required # このページはログインが必須
def index():
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = %s', ('income',))
    total_income = cur.fetchone()[0]

    cur.execute('SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = %s', ('expense',))
    total_expense = cur.fetchone()[0]
    
    cur.close()
    conn.close()

    remaining_budget = INITIAL_BUDGET + total_income - total_expense

    return render_template('index.html', 
                           initial_budget=f'{INITIAL_BUDGET:,.0f}',
                           total_income=f'{total_income:,.0f}',
                           total_expense=f'{total_expense:,.0f}',
                           remaining_budget=f'{remaining_budget:,.0f}')

@app.route('/add', methods=['POST'])
@login_required # 取引の追加もログイン必須
def add_transaction():
    # ... (この関数の中身は変更なし)
    trans_type = request.form.get('type')
    category = request.form.get('category')
    amount_str = request.form.get('amount')
    
    if not all([trans_type, category, amount_str]):
        return jsonify({'success': False, 'message': 'エラー: すべての項目を入力してください。'})
        
    try:
        amount = Decimal(amount_str)
        if amount <= 0:
            raise ValueError()
    except (InvalidOperation, ValueError):
        return jsonify({'success': False, 'message': 'エラー: 金額は正しい数値で入力してください。'})

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO transactions (type, category, amount) VALUES (%s, %s, %s)',
                 (trans_type, category, amount))
    conn.commit()

    cur.execute('SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = %s', ('income',))
    total_income = cur.fetchone()[0]

    cur.execute('SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = %s', ('expense',))
    total_expense = cur.fetchone()[0]
    
    cur.close()
    conn.close()
    
    remaining_budget = INITIAL_BUDGET + total_income - total_expense

    return jsonify({
        'success': True,
        'message': '✓ 取引を追加しました。',
        'total_income': f'{total_income:,.0f}',
        'total_expense': f'{total_expense:,.0f}',
        'remaining_budget': f'{remaining_budget:,.0f}'
    })


@app.route('/history')
@login_required # 履歴の閲覧もログイン必須
def history():
    # ... (この関数の中身は変更なし)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM transactions ORDER BY date DESC')
    transactions = cur.fetchall()
    cur.close()
    conn.close()
    return render_template('history.html', transactions=transactions)
