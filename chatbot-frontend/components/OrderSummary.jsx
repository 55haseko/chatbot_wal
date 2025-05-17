import React from "react";

const OrderSummary = ({ answers, onConfirm }) => {
  const {
    name,
    birthdate,
    gender,
    postalCode,
    address,
    address2,
    phone,
    email,
    payment_method,
  } = answers;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-bold text-gray-800">注文内容の確認</h2>

      <ul className="text-gray-700 space-y-1">
        <li><strong>お名前:</strong> {name}</li>
        <li><strong>生年月日:</strong> {birthdate}</li>
        <li><strong>性別:</strong> {gender}</li>
        <li><strong>住所:</strong> 〒{postalCode} {address} {address2}</li>
        <li><strong>電話番号:</strong> {phone}</li>
        <li><strong>メールアドレス:</strong> {email}</li>
        <li><strong>支払い方法:</strong> {payment_method}</li>
        <li><strong>お支払い金額:</strong> ¥5000（税込）</li>
      </ul>

      <p className="text-sm text-gray-500 mt-4 whitespace-pre-line">
        上記の内容で注文を確定してもよろしいですか？
      </p>

      <div className="w-full flex justify-center mt-4">
        <button
          onClick={onConfirm}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300"
        >
          注文を確定する
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
