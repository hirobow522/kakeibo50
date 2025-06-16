# 家計簿アプリ (Kakeibo App)

シンプルな家計簿（収入・支出）を記録・管理するためのWebアプリケーションです。

## ✨ 主な機能

-   収入と支出の記録
-   ホーム画面でのリアルタイムな予算サマリー表示（収入合計、支出合計、残り予算）
-   全取引履歴の一覧表示
-   クラウドデータベースによるデータの永続化

## 🚀 使用技術

-   **バックエンド:** Python, Flask
-   **フロントエンド:** HTML, CSS, JavaScript (Fetch APIによる非同期通信)
-   **データベース:** PostgreSQL (Supabase)
-   **デプロイメント:** Vercel

## 🔧 セットアップとローカルでの実行方法

このプロジェクトを自分のPCで動かすための手順です。

### 1. リポジトリをクローン

```bash
git clone https://github.com/hirobow522/kakeibo50.git
cd kakeibo50
```

### 2. 仮想環境の作成と有効化

**Windowsの場合:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**Mac/Linuxの場合:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. 必要なライブラリのインストール

```bash
pip install -r requirements.txt
```

### 4. 環境変数の設定

プロジェクトのルートディレクトリに `.env` という名前のファイルを作成し、以下のようにデータベース接続URLを設定します。


```
# .env ファイルの中身
# 値はご自身のSupabaseプロジェクトのものに置き換えてください
POSTGRES_URL_NON_POOLING="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST].supabase.co:5432/postgres"
```


**注意:** `.env` ファイルは `.gitignore` に含まれているため、GitHubにはアップロードされません。

### 5. アプリケーションの実行

```bash
flask run
```

ブラウザで `http://127.0.0.1:5000` にアクセスすると、アプリケーションが表示されます。

## ☁️ Vercelへのデプロイ

このリポジトリはVercelへのデプロイが設定されています。`main`ブランチにプッシュすると、自動的にデプロイが実行されます。
デプロイには、Vercelプロジェクト側で以下の環境変数を設定する必要があります。

-   `POSTGRES_URL_NON_POOLING`: データベース接続URL

## 📁 プロジェクト構成

```
.
├── app.py              # Flaskメインアプリケーション
├── requirements.txt      # 依存ライブラリ一覧
├── vercel.json           # Vercel用設定ファイル
├── static/               # CSS, JavaScriptファイル
│   ├── css/style.css
│   └── js/main.js
├── templates/            # HTMLテンプレート
│   ├── index.html
│   └── history.html
├── .gitignore          # Git無視ファイル
└── README.md             # このファイル
```
