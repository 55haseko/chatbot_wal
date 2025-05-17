// pages/index.js

// Chat画面の本体（チャットウィンドウ）をインポート
import ChatWindow from '../components/ChatWindow';

export default function Home() {
  return (
    // 画面全体を縦横中央に配置＋背景を灰色に
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* チャットウィンドウを表示 */}
      <ChatWindow />
    </div>
  );
}
