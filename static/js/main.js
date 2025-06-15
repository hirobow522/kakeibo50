// static/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    const transactionForm = document.getElementById('transaction-form');
    if (transactionForm) {
        transactionForm.addEventListener('submit', function(e) {
            e.preventDefault(); // デフォルトのフォーム送信を停止

            const form = e.target;
            const formData = new FormData(form);
            const messageArea = document.getElementById('message-area');

            fetch('/add', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // 成功・エラーメッセージを表示
                messageArea.textContent = data.message;
                messageArea.className = data.success ? 'success-message' : 'error-message';

                if (data.success) {
                    // フォームの内容をクリア
                    form.reset();
                    
                    // ホーム画面の数値を更新
                    document.getElementById('total-income').textContent = data.total_income;
                    document.getElementById('total-expense').textContent = data.total_expense;
                    document.getElementById('remaining-budget').textContent = data.remaining_budget;
                }
            })
            .catch(error => {
                console.error('エラー:', error);
                messageArea.textContent = '通信エラーが発生しました。';
                messageArea.className = 'error-message';
            });
        });
    }
});
