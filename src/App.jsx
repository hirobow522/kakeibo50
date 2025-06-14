import React, { useState } from 'react';
import Home from './pages/Home.jsx';
import Input from './pages/Input.jsx';
import History from './pages/History.jsx';
import Settings from './pages/Settings.jsx';
import Help from './pages/Help.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'input':
        return <Input />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">かんたん家計簿50</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-6">
        {renderPage()}
      </main>

      {/* ボトムナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex-1 py-3 px-2 text-center text-sm font-medium ${
              currentPage === 'home' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="text-xl mb-1">🏠</div>
            ホーム
          </button>
          <button
            onClick={() => setCurrentPage('input')}
            className={`flex-1 py-3 px-2 text-center text-sm font-medium ${
              currentPage === 'input' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="text-xl mb-1">✏️</div>
            入力
          </button>
          <button
            onClick={() => setCurrentPage('history')}
            className={`flex-1 py-3 px-2 text-center text-sm font-medium ${
              currentPage === 'history' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="text-xl mb-1">📋</div>
            履歴
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            className={`flex-1 py-3 px-2 text-center text-sm font-medium ${
              currentPage === 'settings' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="text-xl mb-1">⚙️</div>
            設定
          </button>
          <button
            onClick={() => setCurrentPage('help')}
            className={`flex-1 py-3 px-2 text-center text-sm font-medium ${
              currentPage === 'help' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="text-xl mb-1">❓</div>
            ヘルプ
          </button>
        </div>
      </nav>

      {/* ボトムナビゲーション分のスペース確保 */}
      <div className="h-20"></div>
    </div>
  );
}
