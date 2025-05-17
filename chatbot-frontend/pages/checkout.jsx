import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Stripe公開鍵（.env.local に NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY を設定）
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  throw new Error("Stripeの公開キーが未設定です。.env.local に設定してください。");
}

const stripePromise = loadStripe(stripeKey);


/**
 * バックエンド API ベース URL
 * NEXT_PUBLIC_API_BASE が定義されていなければ localhost を使う。
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

/**
 * ────────────────────────────────────────────────────────────────────
 * ユーザーがカード情報を入力 → 支払い確定
 * ────────────────────────────────────────────────────────────────────
 * 1. マウント時に backend /payments/create-payment-intent を呼び
 *    client_secret を取得
 * 2. Stripe Elements の CardElement でカード情報を受け取る
 * 3. ユーザーが「支払う」ボタンを押したら confirmCardPayment を実行
 * 4. 成功したら /order/complete/{order_id} を呼び出し、DB を paid に更新
 */

const CheckoutForm = ({ clientSecret, orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isProcessing) return;
    if (!stripe || !elements) return; // Stripe がまだ読み込み中

    setIsProcessing(true);
    setErrorMsg("");

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        setErrorMsg(error.message ?? "決済に失敗しました。もう一度お試しください。");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // 決済成功 → 注文を完了扱いに更新
        await fetch(`${API_BASE}/order/complete/${orderId}`, {
          method: "POST",
        });
        // 成功画面へ
        router.push(`/success?order_id=${orderId}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("処理中にエラーが発生しました。");
      setIsProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-xl space-y-4"
    >
      <h1 className="text-xl font-bold">お支払い情報</h1>
      <CardElement options={{ hidePostalCode: true }} />

      {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {isProcessing ? "処理中..." : "支払う"}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const router = useRouter();
  const { amount, order_id } = router.query; // クエリパラメータから金額と orderId 取得

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    // amount と order_id が揃ったら PaymentIntent 生成
    if (!amount || !order_id) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/payments/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount),
            order_id: Number(order_id),
            name: name  // ← 追加
          }),
        });           
        if (!res.ok) throw new Error("PaymentIntent 取得に失敗しました");
        const data = await res.json();
        setClientSecret(data.client_secret);
      } catch (err) {
        console.error(err);
        setApiError("サーバーと通信できませんでした。しばらくして再度お試しください。");
      } finally {
        setLoading(false);
      }
    })();
  }, [amount, order_id]);

  if (loading) {
    return <p className="text-center mt-8">読み込み中...</p>;
  }

  if (apiError) {
    return (
      <div className="text-center mt-8 text-red-600">
        <p>{apiError}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center mt-8 text-red-600">
        <p>決済情報が取得できませんでした。</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} orderId={order_id} />
    </Elements>
  );
};

export default CheckoutPage;
