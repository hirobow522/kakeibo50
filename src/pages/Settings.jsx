import React, { useState } from 'react';

export default function Settings() {
  const [monthlyBudget, setMonthlyBudget] = useState('100000');
  const [currency, setCurrency] = useState('JPY');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
              {['給与', 'ボーナス', '副業', 'その他'].map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <button className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
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
}-gray-700 mb-2">支出カテゴリ</h4>
            <div className="flex flex-wrap gap-2">
              {['食費', '交通費', '医療費', '娯楽', '買い物', 'その他'].map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text
