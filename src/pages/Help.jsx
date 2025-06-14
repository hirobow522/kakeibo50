import React, { useState } from 'react';

export default function Help() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const helpSections = [
    {
      id: 'getting-started',
      title: '🚀 はじめに',
      content: `
        かんたん家計簿50へようこそ！このアプリは日々の収入と支出を簡単に記録・管理できるシンプルな家計簿アプリです。

        基本的な使い方：
        1. 「入力」タブで収入や支出を記録
        2. 「履歴」タブで過去の取引を確認・編集
        3. 「ホーム」タブで月間の収支サマリを確認
        4. 「設定」タブで予算や表示設定をカスタマイズ
      `
    },
    {
      id: 'input-transactions',
      title: '💰 収支の記録方法',
      content: `
        収支の記録は「入力」タブから行います：

        1. 収入か支出かを選択
        2. 金額を入力（必須）
        3. カテゴリを選択（必須）
        4. 日付を設定（デフォルトは今日）
        5. 必要に応じて説明を追加
        6. 「記録する」ボタンを押して保存

        ヒント：よく使うカテゴリは設定画面でカスタマイズできます。
      `
    },
    {
      id: 'categories',
      title: '📋 カテゴリについて',
      content: `
        収支をカテゴリ別に分類することで、支出の傾向を把握できます。

        デフォルトのカテゴリ：
        
        【支出】
        • 食費：食材、外食、飲み物など
        • 交通費：電車、バス、タクシー、ガソリンなど
        • 医療費：病院、薬、健康関連の費用
        • 娯楽：映画、ゲーム、趣味の費用
        • 買い物：衣類、雑貨、家電など
        • その他：上記以外の支出

        【収入】
        • 給与：毎月の基本給
        • ボーナス：賞与、特別手当
        • 副業：アルバイト、フリーランス収入
        • その他：投資収益、お小遣いなど
      `
    },
    {
      id: 'budget-management',
      title: '🎯 予算管理',
      content: `
        設定画面で月間予算を設定すると、支出の管理がしやすくなります：

        1. 「設定」タブを開く
        2. 「月間予算」に目標金額を入力
        3. 「設定を保存」ボタンを押す

        ホーム画面で予算に対する進捗を確認できます。
        予算を超えそうな場合は通知でお知らせします（通知設定が有効な場合）。
      `
    },
    {
      id: 'data-management',
      title: '💾 データの管理',
      content: `
        大切な家計簿データを安全に管理する方法：

        【データのバックアップ】
        • 設定画面の「データをエクスポート」でCSVファイルをダウンロード
        • 定期的にバックアップを取ることをお勧めします

        【データの復元】
        • 「データをインポート」で以前のデータを復元可能
        • 機種変更時にも便利です

        【データの削除】
        • 「すべてのデータを削除」で初期状態にリセット
        • 削除したデータは復元できませんのでご注意ください
      `
    },
    {
      id: 'tips',
      title: '💡 便利な使い方',
      content: `
        より効果的に家計簿を活用するためのヒント：

        • 毎日の記録：支出をした時にすぐ記録する習慣をつけましょう
        • 週次確認：週に一度は履歴を見直して支出パターンを確認
        • カテゴリ分析：どのカテゴリに多く支出しているかを把握
        • 予算設定：現実的な予算を設定して無理のない家計管理を
        • 定期的なバックアップ：月に一度はデータをエクスポート

        継続は力なり！無理せず続けることが成功の秘訣です。
      `
    },
    {
      id: 'troubleshooting',
      title: '🔧 よくある質問',
      content: `
        Q: データが消えてしまいました
        A: 定期的なバックアップを取ることをお勧めします。データはブラウザのローカルストレージに保存されているため、ブラウザのデータ削除で消える可能性があります。

        Q: 間違って記録してしまいました
        A: 履歴画面から該当の取引を編集または削除できます。

        Q: カテゴリを追加したいです
        A: 現在のバージョンではカテゴリのカスタマイズ機能は開発中です。「その他」カテゴリをご利用ください。

        Q: グラフで表示したいです
        A: 今後のアップデートでグラフ機能を追加予定です。

        Q: スマートフォンで使えますか？
        A: はい、レスポンシブデザインでスマートフォンでも快適に使用できます。
      `
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ヘルプ・使い方ガイド</h2>
        <p className="text-gray-600 mb-6">
          かんたん家計簿50の使い方を説明します。質問がある項目をクリックしてください。
        </p>

        <div className="space-y-3">
          {helpSections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800">{section.title}</span>
                <span className="text-gray-500">
                  {expandedSection === section.id ? '−' : '+'}
                </span>
              </button>
              
              {expandedSection === section.id && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <div className="pt-3 text-gray-700 whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* お問い合わせ */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">お問い合わせ</h3>
        <p className="text-gray-600 mb-4">
          その他のご質問やご要望がありましたら、以下の方法でお問い合わせください。
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-blue-600">📧</span>
            <span className="text-gray-700">メール: support@kakeibo50.app</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-600">💬</span>
            <span className="text-gray-700">チャット: アプリ内チャット機能（開発中）</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-purple-600">🐛</span>
            <span className="text-gray-700">バグ報告: GitHub Issues</span>
          </div>
        </div>
      </div>

      {/* バージョン情報 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">アプリ情報</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>かんたん家計簿50 v1.0.0</p>
          <p>リリース日: 2025年6月15日</p>
          <p>© 2025 Kakeibo50 Team</p>
        </div>
      </div>
    </div>
  );
}
