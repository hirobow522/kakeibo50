import React, { useState } from 'react';

export default function Settings() {
  const [monthlyBudget, setMonthlyBudget] = useState('100000');
  const [currency, setCurrency] = useState('JPY');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showCategoryEdit, setShowCategoryEdit] = useState(false);
  
  // カテゴリの状態管理
  const [incomeCategories, setIncomeCategories] = useState(['給与', 'ボーナス', '副業', 'その他']);
  const [expenseCategories, setExpenseCategories] = useState(['食費', '交通費', '医療費', '娯楽', '買い物', 'その他']);
  const [newCategory, setNewCategory] = useState('');
  const [editingType, setEditingType] = useState('expense'); // 'income' or 'expense'

  const handleSave = () => {
    // 設定を保存する処理
    console.log({
      monthlyBudget: parseFloat(monthlyBudget),
      currency,
      notifications,
      darkMode
    });
    alert('設定を保存しました！');
  };

  const handleExport = () => {
    alert('データのエクスポート機能は開発中です');
  };

  const handleImport = () => {
    alert('データのインポート機能は開発中です');
  };

  const handleReset = () => {
    if (confirm('本当にすべてのデータを削除しますか？この操作は取り消せません。')) {
      alert('データをリセットしました');
    }
  };

  const handleCategoryEdit = () => {
    setShowCategoryEdit(true);
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      alert('カテゴリ名を入力してください');
      return;
    }

    const currentCategories = editingType === 'income' ? incomeCategories : expenseCategories;
    
    if (currentCategories.includes(newCategory.trim())) {
      alert('そのカテゴリは既に存在します');
      return;
    }

    if (editingType === 'income') {
      setIncomeCategories([...incomeCategories, newCategory.trim()]);
    } else {
      setExpenseCategories([...expenseCategories, newCategory.trim()]);
    }
    
    setNewCategory('');
  };

  const handleDeleteCategory = (category, type) => {
    if (confirm(`「${category}」を削除しますか？`)) {
      if (type === 'income') {
        setIncomeCategories(incomeCategories.filter(c => c !== category));
      } else {
        setExpenseCategories(expenseCategories.filter(c => c !== category));
      }
    }
  };

  const handleCloseCategoryEdit = () => {
    setShowCategoryEdit(false);
    setNewCategory('');
  };

  // カテゴリ編集画面
  if (showCategoryEdit) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">カテゴリ編集</h2>
            <button
              onClick={handleCloseCategoryEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* タブ切り替え */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => setEditingType('expense')}
              className={`px-4 py-2 font-medium ${
                editingType === 'expense'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              支出カテゴリ
            </button>
            <button
              onClick={() => setEditingType('income')}
              className={`px-4 py-2 font-medium ${
                editingType === 'income'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              収入カテゴリ
            </button>
          </div>

          {/* 新しいカテゴリ追加 */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="新しいカテゴリ名"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button
                onClick={handleAddCategory}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                追加
              </button>
            </div>
          </div>

          {/* カテゴリ一覧 */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 mb-3">
              {editingType === 'income' ? '収入' : '支出'}カテゴリ
            </h4>
            
            {(editingType === 'income' ? incomeCategories : expenseCategories).map((category) => (
              <div
                key={category}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-800">{category}</span>
                <button
                  onClick={() => handleDeleteCategory(category, editingType)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  削除
                </button>
              </div>
            ))}
          </div>

          {/* 保存ボタン */}
          <button
            onClick={handleCloseCategoryEdit}
            className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            変更を保存
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 基本設定 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">基本設定</h2>
        
        <div className="space-y-4">
          {/* 月予算 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              月間予算
            </label>
            <div className="relative">
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2 text-gray-500">円</span>
            </div>
          </div>

          {/* 通貨 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              通貨
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="JPY">日本円 (¥)</option>
              <option value="USD">米ドル ($)</option>
              <option value="EUR">ユーロ (€)</option>
            </select>
          </div>

          {/* 通知設定 */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">通知を有効にする</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* ダークモード */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">ダークモード</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          設定を保存
        </button>
      </div>

      {/* データ管理 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">データ管理</h3>
        
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            データをエクスポート
          </button>
          
          <button
            onClick={handleImport}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            データをインポート
          </button>
          
          <button
            onClick={handleReset}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            すべてのデータを削除
          </button>
        </div>
      </div>

      {/* カテゴリ管理 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">カテゴリ管理</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">収入カテゴリ</h4>
            <div className="flex flex-wrap gap-2">
              {incomeCategories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">支出カテゴリ</h4>
            <div className="flex flex-wrap gap-2">
              {expenseCategories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleCategoryEdit}
          className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          カテゴリを編集
        </button>
      </div>

      {/* アプリ情報 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">アプリ情報</h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>バージョン</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>最終更新</span>
            <span>2025年6月15日</span>
          </div>
        </div>
      </div>
    </div>
  );
}
