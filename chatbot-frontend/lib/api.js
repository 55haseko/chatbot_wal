// axiosをインポートしてHTTPリクエストを送るための機能を使えるようにする
import axios from 'axios';

// axiosのインスタンスを作成（共通の設定：APIのベースURLを環境変数から取得）
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // 例: http://localhost:8000 みたいなやつ
});

// 郵便番号から住所を取得する関数（GETリクエストを送る）
export const resolveAddress = (postal_code) =>
  api.get(`/utils/resolve-address?postal_code=${postal_code}`);
// 例: /utils/resolve-address?postal_code=1234567 にアクセスして、住所情報を取得

// 注文を開始する関数（POSTリクエストで注文データを送る）
export const initiateOrder = (orderData) =>
  api.post('/order/initiate', orderData);
// 例: 注文商品やユーザー情報などをサーバーに送って注文をスタートさせる

// Stripeの支払いIntentを作成する関数（支払い金額をサーバーに送る）
export const createPaymentIntent = (amount) =>
  api.post('/payments/create-payment-intent', { amount });
// 例: サーバー側でStripeのPaymentIntentを作成して、クライアントに返す

// 支払い完了後に注文を確定する関数（注文IDを使って注文確定のリクエストを送る）
export const completeOrder = (order_id) =>
  api.post(`/order/complete/${order_id}`);
// 例: 支払いが成功したらこの関数を呼び出して、注文ステータスを「完了」にする
