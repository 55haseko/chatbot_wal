// pages/success.jsx
import { useRouter } from "next/router";
import Link from "next/link";

const SuccessPage = () => {
  const router = useRouter();
  const { order_id } = router.query;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 text-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">お支払いが完了しました！</h1>
        <p className="text-gray-700 mb-2">ご注文ありがとうございました。</p>
        {order_id && (
          <p className="text-sm text-gray-500 mb-4">注文ID：<span className="font-mono">{order_id}</span></p>
        )}
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
