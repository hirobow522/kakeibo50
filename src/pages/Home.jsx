import React, { useState } from 'react';

export default function Home() {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // 仮のデータ
  const monthlyBudget = 100000;
  const totalExpense = 35000;
  const totalIncome = 50000;
  const remainingBudget = monthlyBudget - totalExpense;

  const expenseCategories = ['食費', '交通費', '医療費', '娯楽', '買い物', 'その他'];
  const incomeCategories = ['給与', 'ボーナス', '副業', 'その他'];

  const handleQuickAction = (type) => {
    setTransactionType(type);
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddTransaction(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      alert('金額とカテゴリは必須です');
      return;
    }

    // ここで実際のデータ保存処理を行う
    console.log('Transaction saved:', {
      ...formData,
      type: transactionType,
      amount: parseFloat(formData.amount)
    });

    alert(`${transactionType === 'income' ? '収入' : '支出'}を記録しました！`);
    setShowAddTransaction(false);
  };

  const handleCancel = () => {
    setShowAddTransaction(false);
  };

  if (showAddTransaction) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {transactionType === 'income' ? '収入を記録' : '支出を記録'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              金額
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                required
              />
              <span className="absolute right-3 top-2 text-gray-500">円</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">カテゴリを選択</option>
              {(transactionType === 'income' ? incomeCategories : expenseCategories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="説明を入力（任意）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日付
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors text-white ${
                transactionType === 'income'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              記録する
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 月間予算概要 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">今月の予算</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">収入</p>
            <p className="text-2xl font-bold text-green-600">¥{totalIncome.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">支出</p>
            <p className="text-2xl font-bold text-red-600">¥{totalExpense.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className="bg-blue-500 h-4 rounded-full" 
            style={{ width: `${Math.min((totalExpense / monthlyBudget) * 100, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>残り予算: ¥{remainingBudget.toLocaleString()}</span>
          <span>{Math.round((totalExpense / monthlyBudget) * 100)}%</span>
        </div>
      </div>

      {/* クイックアクション */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">クイックアクション</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleQuickAction('income')}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="mr-2">💰</span>
            収入を記録
          </button>
          
          <button
            onClick={() => handleQuickAction('expense')}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="mr-2">💸</span>
            支出を記録
          </button>
        </div>
      </div>

      {/* 最近の取引 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">最近の取引</h3>
        
        <div className="space-y-3">
          {/* 仮のデータ */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">食費</p>
              <p className="text-sm text-gray-600">2025/06/15</p>
            </div>
            <p className="text-red-600 font-semibold">-¥1,500</p>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">給与</p>
              <p className="text-sm text-gray-600">2025/06/01</p>
            </div>
            <p className="text-green-600 font-semibold">+¥300,000</p>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">交通費</p>
              <p className="text-sm text-gray-600">2025/06/14</p>
            </div>
            <p className="text-red-600 font-semibold">-¥500</p>
          </div>
        </div>
        
        <button className="w-full mt-4 text-blue-500 hover:text-blue-600 font-medium">
          すべての取引を見る
        </button>
      </div>
    </div>
  );
}
