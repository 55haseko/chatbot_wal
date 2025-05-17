// pages/test.jsx
export default function Test() {
    const message = `以下の銀行口座にお振込をお願いいたします。
  
  銀行名：三井住友銀行
  支店名：渋谷支店（123）
  口座種別：普通
  口座番号：1234567
  口座名義：カ）ワカナ
  
  ※お振込の際は「注文番号」または「ご登録のお名前」をお名前欄にご記入ください。
  ※振込手数料はお客様負担となります。
  
  ご入金確認後、正式にご注文を確定させていただきます。`;
  
    return (
      <div className="p-8">
        <h1 className="text-xl mb-4">改行テスト</h1>
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded border">
          {message}
        </pre>
      </div>
    );
  }
  