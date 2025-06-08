import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = ({ answers, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const createOrderAndIntent = async () => {
      const orderRes = await fetch(`${backendURL}/order/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${answers.name?.lastName || ""} ${answers.name?.firstName || ""}`,
          email: answers.email,
          phone: answers.phone,
          address: `${answers.address || ""} ${answers.address2 || ""}`,
          birthdate:
            answers.birthdate?.year && answers.birthdate?.month && answers.birthdate?.day
              ? `${answers.birthdate.year}-${String(answers.birthdate.month).padStart(2, "0")}-${String(answers.birthdate.day).padStart(2, "0")}`
              : "",
          amount: 5000,
          payment_method: "stripe",
        }),
      });
      const { order_id } = await orderRes.json();

      const intentRes = await fetch(`${backendURL}/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000, order_id }),
      });
      const { client_secret } = await intentRes.json();
      setClientSecret(client_secret);

      localStorage.setItem("order_id", order_id);
    };
    createOrderAndIntent();
  }, [answers, backendURL]);

  const handleCardChange = (event) => {
    setIsCardComplete(event.complete);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

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
      setIsProcessing(false);
    } else {
      const order_id = localStorage.getItem("order_id");
      await fetch(`${backendURL}/order/complete/${order_id}`, { method: "POST" });
      alert("決済成功しました！");
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4 p-4 border rounded bg-white">
      <input
        type="text"
        name="fake-card-field"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          height: "0px",
          width: "0px",
          opacity: "0",
        }}
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
      />

      <CardElement
        onChange={handleCardChange}
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
        disabled={!stripe || !clientSecret || !isCardComplete || isProcessing}
        className={`bg-blue-600 text-white px-4 py-2 rounded w-full ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isProcessing ? "処理中..." : "カードで支払う"}
      </button>
    </form>
  );
};

export default CheckoutForm;
