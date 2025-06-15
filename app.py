# app.py
import os
import psycopg2
from psycopg2.extras import DictCursor
from flask import Flask, render_template, request, jsonify
from decimal import Decimal, InvalidOperation

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your_default_secret_key')

# ステップ1で設定したVercelの環境変数からデータベースURLを取得
# 新しいコード（修正後）
DATABASE_URL = os.environ.get('POSTGRES_URL_NON_POOLING')

# データベース接続を管理する関数
def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=DictCursor)
    return conn

# データベースにテーブルがなければ作成する関数
def init_db():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                type VARCHAR(10) NOT NULL,
                category VARCHAR(50) NOT NULL,
                amount NUMERIC(10, 2) NOT NULL,
                date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        ''')
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database initialization failed: {e}")

# アプリ起動時にテーブルの存在を確認・作成
with app.app_context():
    init_db()
    
# 初期予算（例として50000円）
INITIAL_BUDGET = Decimal('50000')

@app.route('/')
def index():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # 収入と支出の合計を正しく計算
    cur.execute('SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = %s', ('income',))
    total_income = cur.fetchone()[0]

    cur.execute('SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = %s', ('expense',))
    total_expense = cur.fetchone()[0]
    
    cur.close()
    conn.close()

    remaining_budget = INITIAL_BUDGET + total_income - total_expense

    return render_template('index.html', 
                           initial_budget=INITIAL_BUDGET,
                           total_income=total_income,
                           total_expense=total_expense,
                           remaining_budget=remaining_budget)

@app.route('/add', methods=['POST'])
def add_transaction():
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

    # 更新後の合計を再計算
    cur.execute('SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = %s', ('income',))
    total_income = cur.fetchone()[0]

    cur.execute('SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = %s', ('expense',))
    total_expense = cur.fetchone()[0]
    
    cur.close()
    conn.close()
    
    remaining_budget = INITIAL_BUDGET + total_income - total_expense

    # 画面更新用の最新データを返す
    return jsonify({
        'success': True,
        'message': '✓ 取引を追加しました。',
        'total_income': f'{total_income:,.0f}',
        'total_expense': f'{total_expense:,.0f}',
        'remaining_budget': f'{remaining_budget:,.0f}'
    })

@app.route('/history')
def history():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM transactions ORDER BY date DESC')
    transactions = cur.fetchall()
    cur.close()
    conn.close()
    return render_template('history.html', transactions=transactions)
