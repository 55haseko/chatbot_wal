import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = ({ answers, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // ⭐️ 処理中フラグ追加

  useEffect(() => {
    const createOrderAndIntent = async () => {
      const orderRes = await fetch("http://localhost:8000/order/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: answers.name?.lastName + " " + answers.name?.firstName,
          email: answers.email,
          phone: answers.phone,
          address: `${answers.address} ${answers.address2}`,
          birthdate:
            answers.birthdate?.year && answers.birthdate?.month && answers.birthdate?.day
              ? `${answers.birthdate.year}-${String(answers.birthdate.month).padStart(2, "0")}-${String(answers.birthdate.day).padStart(2, "0")}`
              : "",
          amount: 5000,
          payment_method: "stripe",
        }),
      });
      const { order_id } = await orderRes.json();

      const intentRes = await fetch("http://localhost:8000/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000, order_id }),
      });
      const { client_secret } = await intentRes.json();
      setClientSecret(client_secret);

      localStorage.setItem("order_id", order_id);
    };
    createOrderAndIntent();
  }, [answers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isProcessing) {
      // すでに送信中なら処理をしない
      return;
    }
    setIsProcessing(true); // ⭐️ 送信開始時にtrueにする

    console.log("🔍 answers:", answers);
    console.log("🔍 postalCode:", answers.postalCode);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: answers.email,
          address: {
            postal_code: answers.postalCode,
          },
        },
      },
    });

    if (result.error) {
      alert("決済エラー：" + result.error.message);
      setIsProcessing(false); // ⭐️ エラー時に再送信可能に
    } else {
      const order_id = localStorage.getItem("order_id");
      await fetch(`http://localhost:8000/order/complete/${order_id}`, {
        method: "POST",
      });
      alert("決済成功しました！");
      onSuccess();
      // ⭐️ 正常終了後は再度送信を許可しなくてOK。フォームが消える想定？
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white">
      <CardElement
        options={{
          hidePostalCode: true,
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": { color: "#a0aec0" },
            },
            invalid: { color: "#fa755a" },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe || !clientSecret || isProcessing} // ⭐️ ここでisProcessingも考慮
        className={`bg-blue-600 text-white px-4 py-2 rounded w-full ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isProcessing ? "処理中..." : "カードで支払う"}
      </button>
    </form>
  );
};

export default CheckoutForm;
