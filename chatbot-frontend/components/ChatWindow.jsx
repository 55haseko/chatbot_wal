import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import AddressDetail from "./AddressDetail";
import { resolveAddress } from "../lib/api";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const fetchAddressFromPostalCodeMock = (postalCode) => {
  const codePrefix = postalCode.slice(0, 3);
  switch (codePrefix) {
    case "100": return "東京都千代田区";
    case "106": return "東京都港区六本木";
    case "150": return "東京都渋谷区";
    default: return "東京都〇〇市";
  }
};

const USE_MOCK = false;

function validateInput(key, input) {
  switch (key) {
    case "birthdate":
      return (
        typeof input === "object" &&
        input?.year &&
        input?.month &&
        input?.day
      );

    case "name":
      return (
        typeof input === "object" &&
        input?.lastName?.trim().length > 0 &&
        input?.firstName?.trim().length > 0
      );
    case "address":
    case "address2": return input.trim().length > 0;
    case "postalCode": return /^\d{7}$/.test(input);
    case "phone": return /^\d{10,11}$/.test(input);
    case "email": return /\S+@\S+\.\S+/.test(input);
    default: return true;
  }
}

const ChatWindow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [addressSuggestion, setAddressSuggestion] = useState("");
  const router = useRouter();
  const currentRef = useRef(null);
  const containerRef = useRef(null);
  const [error, setError] = useState("");
  const questions = [
    {
      id: "intro_image",
      type: "image",
      src: "/start-banner.png", // public ディレクトリ内
    },
    
    {
      id: "info_name",
      type: "info",
      text: "ご注文者様のお名前を教えてください。",
    },
    { id: "name_and_furigana", type: "nameAndFuriganaSplit" },

  
    {
      id: "info_birthdate",
      type: "info",
      text: "生年月日を入力してください。",
    },
    { id: "birthdate", type: "birthdateSelect" },

  
    {
      id: "info_gender",
      type: "info",
      text: "性別を選択してください。",
    },
    { id: "gender", type: "select", options: ["男性", "女性", "その他"] },
  
    {
      id: "info_address",
      type: "info",
      text: "次にご注文者様のご住所を教えてください。",
    },
    
    {
      id: "address_detail",
      type: "addressDetail",
    },


    {
      id: "info_contact",
      type: "info",
      text: "ご注文者様のご連絡先を入力してください。",
    },
    {
      id: "phone_split",
      type: "phoneSplit", // 新しいカスタムタイプ
    },
    

    { id: "payment_method",     type: "select", options: ["クレジットカード","口座振込"] },

    { id: "confirm_order",      type: "confirm" },
    
    { id: "payment_success", type: "info", text: "ご利用ありがとうございました。\n口座振り込みの方は入金が確認され次第、メールを送信いたします。" },

  ];
  
  const getDynamicText = (q) => {
    if (q.id === "info_payment_notice") {
      const method = answers.payment_method;
      if (method === "クレジットカード") {
        return "この後、クレジットカードでの決済画面に進みます。\nカードをご用意ください。";
      } else if (method === "口座振込") {
        return `以下の銀行口座にお振込をお願いいたします。

          銀行名：三井住友銀行
          支店名：渋谷支店（123）
          口座種別：普通
          口座番号：1234567
          口座名義：カ）ワカナ

          ※お振込の際は「注文番号」または「ご登録のお名前」をお名前欄にご記入ください。
          ※振込手数料はお客様負担となります。

          ご入金確認後、正式にご注文を確定させていただきます。`;

  }
                  }
                  return q.text || "";
                };
  

useEffect(() => {
  const fetchAddress = async () => {
    if (!answers.postalCode) return;

    if (USE_MOCK) {
      const mockAddress = fetchAddressFromPostalCodeMock(answers.postalCode);
      // ここもオブジェクトに合わせてセットする
      setAnswers(prev => ({
        ...prev,
        prefecture: "東京都",
        city: mockAddress
      }));
    } else {
      try {
        const res = await resolveAddress(answers.postalCode);
        const { prefecture, city } = res.data;
        console.log("📦 APIから取得した住所：", {
          postalCode: answers.postalCode,
          prefecture,
          city
        });

        setAnswers(prev => ({
          ...prev,
          prefecture: prefecture || "",
          city: city || ""
        }));
      } catch {
        console.error("住所取得失敗");
      }
    }
  };
  fetchAddress();
}, [answers.postalCode]);

  
  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    if (error) setError("");
  };
  const handleNext = () => {
    const currentId = questions[currentStep].id;
    const inputValue = answers[currentId] || "";
  
    if (!validateInput(currentId, inputValue)) {
      setError("入力内容が正しくありません。もう一度確認してください。");
      return;
    }

    // 住所入力ステップでは、postalCode／prefecture／city／addressDetail が揃っているかチェック
    if (currentId === "address_detail") {
      const { postalCode, prefecture, city, addressDetail } = answers;
      if (
        !/^\d{7}$/.test(postalCode || "") ||
        !prefecture?.trim() ||
        !city?.trim() ||
        !addressDetail?.trim()
      ) {
        setError("住所のすべての項目を正しく入力してください。");
        return;
      }
    }
  
    setError("");
  
    if (currentId === "payment_method") {
      const confirmIndex = questions.findIndex(q => q.id === "confirm_order");
      if (confirmIndex !== -1) {
        setCurrentStep(confirmIndex);
      }
      return;
    }
    
  
    setCurrentStep(prev => prev + 1);
  };


  // 支払い方法を変更した後の自動ジャンプを防ぐ（不要になったステップのスキップ）

  useEffect(() => {
    const idx = questions.findIndex(q => q.id === "info_payment_notice");
    if (idx !== -1 && currentStep > idx) {
      setCurrentStep(idx);
    }
  }, [answers.payment_method]);
  
  
  
  
  // スクロール

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentStep]);


  return (
    <>
      
  
      <div
        ref={containerRef}
        className="w-full max-w-lg h-[90vh] p-4 shadow-md rounded-lg overflow-y-auto flex flex-col-reverse"
        style={{ backgroundColor: "var(--chat-back-color)" }}
      >

        <div className="pt-[40vh]" />
  
      {/* 現在の質問 */}
      {currentStep < questions.length && (
        <div ref={currentRef} className="w-full mb-4">
          
          


          {questions[currentStep].type === "image" ? (
            <div className="w-full mb-4">
              <img
                src={questions[currentStep].src}
                alt="intro"
                className="w-full rounded-lg shadow"
              />
              <AutoAdvance
                onDone={() => setCurrentStep((prev) => prev + 1)}
                delay={1500}
              />
            </div>
            

          ) : questions[currentStep].id === "payment_method" ? (
            <div className="p-4 bg-gray-100 rounded-lg space-y-4">

              {/* 選択ボタン */}
              <div className="flex space-x-2">
                {questions[currentStep].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleChange("payment_method", opt)}
                    className={`px-4 py-2 rounded ${
                      answers.payment_method === opt
                        ? "bg-gray-600 text-white"
                        : "border border-gray-600 text-gray-600"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* クレジットカード決済フォーム */}
              {answers.payment_method === "クレジットカード" && (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    answers={answers}
                    onSuccess={() => {
                      // 決済成功後は次へ（confirm_order に進むだけ）
                      const confirmIndex = questions.findIndex(q => q.id === "confirm_order");
                      setCurrentStep(confirmIndex);
                    }}
                  />
                </Elements>
              )}

              {/* 口座振込の説明 */}
              {answers.payment_method === "口座振込" && (
                <div className="p-3 bg-white border rounded text-gray-700">
                  以下の銀行口座にお振込をお願いいたします。<br />
                  銀行名：三井住友銀行 支店名：渋谷支店（123）<br />
                  口座種別：普通 口座番号：1234567<br />
                  口座名義：カ）ワカナ<br />
                  ※お振込の際は「注文番号」または「ご登録のお名前」をお名前欄にご記入ください。<br />
                  ※振込手数料はお客様負担となります。<br />
                  ご入金確認後、正式にご注文を確定させていただきます。
                </div>
              )}

              {/* 次へボタン（クレカは CheckoutForm に onSuccess があるので不要、振込時のみ） */}
              {answers.payment_method === "口座振込" && (
                <button
                  onClick={handleNext}
                  className="w-full mt-4 bg-yellow-500 text-white py-2 rounded"
                >
                  注文を確定する
                </button>
              )}

            </div>

          
          
          
          ) : questions[currentStep].type === "confirm" ? (
            <OrderSummary
              answers={answers}
              onConfirm={() => {
                const successIdx = questions.findIndex(q => q.id === "payment_success");
                setCurrentStep(successIdx);
              }}
            />

          ) : questions[currentStep].type === "addressDetail" ? (
          
            // ─── ここが新しく追加する「住所入力用コンポーネント」描画部 ───
            <AddressDetail
              address={{
                postalCode: answers.postalCode || "",
                prefecture: answers.prefecture || "",
                city: answers.city || "",
                addressDetail: answers.addressDetail || "",
              }}
              onChange={(field, value) =>
                setAnswers((prev) => ({ ...prev, [field]: value }))
              }
              onNext={handleNext}
            />

          ) : questions[currentStep].type === "info" ? (
            <>
              <div className="flex items-start space-x-2 mb-4">
                <img
                  src="/operator.png"
                  alt="オペレーター"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div
                  className="whitespace-pre-wrap break-words text-black px-4 py-2 rounded-2xl rounded-tl-none shadow max-w-[80%]"
                  style={{ backgroundColor: "var(--chat-info-bubble-color)" }}
                >
                  {getDynamicText(questions[currentStep])}
                </div>

              </div>
              <AutoAdvance
                onDone={() => setCurrentStep((prev) => prev + 1)}
                delay={500}
              />
            </>
          ) : (
            <>
              <ChatMessage
                questionObj={questions[currentStep]}
                question={questions[currentStep].text}
                type={questions[currentStep].type}
                options={questions[currentStep].options || []}
                value={
                  answers[questions[currentStep].id] || ""
                }
                isActive={true}
                editable={false}
                onChange={(val) =>
                  handleChange(questions[currentStep].id, val)
                }
                onNext={handleNext}
              />
              {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
              )}
            </>
          )}
        </div>
      )}
      


        {/* 過去の質問（編集可能） */}
        {questions.slice(0, currentStep).reverse().map((q, indexReversed) => {
          const index = currentStep - 1 - indexReversed;
          return (
            <div key={q.id} className="w-full mb-4">
            {q.type === "image" ? (
              <img
                src={q.src}
                alt="履歴画像"
                className="w-full rounded-lg shadow"
              />
            ) : q.type === "info" ? (


            <div className="flex items-start space-x-2 mb-4">
            <img
              src="/operator.png"
              alt="オペレーター"
              className="w-10 h-10 rounded-full object-cover"
            />
            
            <div
  className="text-black px-4 py-2 whitespace-pre-wrap break-words rounded-2xl rounded-tl-none shadow max-w-[80%]"
  style={{ backgroundColor: "var(--chat-info-bubble-color)" }}
>
  {getDynamicText(q)}
</div>


            </div>



              ) : (
                <ChatMessage
                  question={q.text}
                  type={q.type}
                  options={q.options || []}
                  value={answers[q.id] || ""}
                  isActive={false}
                  editable={true}
                  onChange={(val) => handleChange(q.id, val)}
                  onNext={() => {}}
                />
              )}
            </div>
          );
        })}


      </div>
    </>
  );
}
const AutoAdvance = ({ onDone, delay = 500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, delay);
    return () => clearTimeout(timer);
  }, [onDone, delay]);

  return null;
};

export default ChatWindow;