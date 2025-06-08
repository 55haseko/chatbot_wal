import React, { useState, useEffect } from "react";
import * as wanakana from "wanakana";

const ChatMessage = ({
  question,
  type = "text",
  options = [],
  value = "",
  isActive = false,
  editable = false,
  onChange,
  onNext,
}) => {
  const handleSubmit = () => {
    if (onChange) onChange(value);
    if (onNext) onNext();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };




  const [furiganaEdited, setFuriganaEdited] = useState({
    lastName: false,
    firstName: false,
  });

  return (
    <div
      className="bg-white shadow rounded-xl p-4 mb-4"
      style={{ backgroundColor: "var(--chat-bg-color)" }}
    >
      <p
        className="text-gray-800 font-semibold mb-2 whitespace-pre-line"
        style={{ color: "var(--chat-text-color)" }}
      >
        {question}
      </p>

      {isActive || editable ? (
        <div>
          {type === "text" && (
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded mb-2"
              style={{ backgroundColor: "var(--chat-input-bg)" }}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}

{type === "nameAndFuriganaSplit" && (
  <div>
    {/* 氏名 */}
    <label className="block mb-1 text-gray-800" style={{ color: "var(--chat-text-color)" }}>
      お名前（氏名）
    </label>
    <div className="flex space-x-2 mb-2">
      <input
        type="text"
        placeholder="姓"
        className="w-1/2 border border-gray-300 p-2 rounded"
        style={{ backgroundColor: "var(--chat-input-bg)" }}
        value={value?.lastName || ""}
        onChange={(e) => {
          const newLastName = e.target.value;
          const isKanaOrRomaji = /^[a-zA-Zぁ-んー]*$/.test(newLastName);
          const katakana = isKanaOrRomaji ? wanakana.toKatakana(newLastName) : value?.furiganaLastName || "";

          onChange?.({
            ...value,
            lastName: newLastName,
            furiganaLastName: furiganaEdited.lastName
              ? value?.furiganaLastName
              : katakana,
          });
        }}
      />
      <input
        type="text"
        placeholder="名"
        className="w-1/2 border border-gray-300 p-2 rounded"
        style={{ backgroundColor: "var(--chat-input-bg)" }}
        value={value?.firstName || ""}
        onChange={(e) => {
          const newFirstName = e.target.value;
          const isKanaOrRomaji = /^[a-zA-Zぁ-んー]*$/.test(newFirstName);
          const katakana = isKanaOrRomaji ? wanakana.toKatakana(newFirstName) : value?.furiganaFirstName || "";

          onChange?.({
            ...value,
            firstName: newFirstName,
            furiganaFirstName: furiganaEdited.firstName
              ? value?.furiganaFirstName
              : katakana,
          });
        }}
      />
    </div>

    {/* フリガナ */}
    <label className="block mb-1 text-gray-800" style={{ color: "var(--chat-text-color)" }}>
      フリガナ
    </label>
    <div className="flex space-x-2 mb-2">
      <input
        type="text"
        placeholder="セイ"
        className="w-1/2 border border-gray-300 p-2 rounded"
        style={{ backgroundColor: "var(--chat-input-bg)" }}
        value={value?.furiganaLastName || ""}
        onChange={(e) => {
          onChange?.({
            ...value,
            furiganaLastName: e.target.value,
          });
          setFuriganaEdited((prev) => ({
            ...prev,
            lastName: true,
          }));
        }}
      />
      <input
        type="text"
        placeholder="メイ"
        className="w-1/2 border border-gray-300 p-2 rounded"
        style={{ backgroundColor: "var(--chat-input-bg)" }}
        value={value?.furiganaFirstName || ""}
        onChange={(e) => {
          onChange?.({
            ...value,
            furiganaFirstName: e.target.value,
          });
          setFuriganaEdited((prev) => ({
            ...prev,
            firstName: true,
          }));
        }}
      />
    </div>
  </div>
)}


          {type === "birthdateSelect" && (
            <div className="flex flex-col items-center space-y-3 mb-4">
              <div className="flex items-center justify-center space-x-6 text-lg">
                {/* 年 */}
                <div className="flex items-center space-x-1">
                  <span className="text-gray-800">年</span>
                  <select
                      className="border rounded px-4 py-2 text-lg"
                      value={value?.year || ""} // デフォルト値は -- の value("") を指定
                      onChange={(e) => onChange?.({ ...value, year: e.target.value })}
                    >
                      {Array.from({ length: 120 }, (_, i) => 1905 + i)
                        .reverse()
                        .flatMap((y) => {
                          if (y === 1991) {
                            return [
                              <option key={y} value={y}>{y}年</option>,
                              <option key="empty" value="">--</option>, // ← 「--」は空文字 value にして間に挿入
                            ];
                          } else {
                            return <option key={y} value={y}>{y}年</option>;
                          }
                        })}
                    </select>

                </div>

                {/* 月 */}
                <div className="flex items-center space-x-1">
                  <span
                    className="text-gray-800"
                    style={{ color: "var(--chat-text-color)" }}
                  >
                    月
                  </span>
                  <select
                    className="border rounded px-4 py-2 text-lg"
                    style={{
                      backgroundColor: "var(--chat-input-bg)",
                      borderColor: "var(--chat-input-border, #ccc)",
                    }}
                    value={value?.month || ""}
                    onChange={(e) => onChange?.({ ...value, month: e.target.value })}
                  >
                    <option value="">--</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m}月
                      </option>
                    ))}
                  </select>
                </div>

                {/* 日 */}
                <div className="flex items-center space-x-1">
                  <span
                    className="text-gray-800"
                    style={{ color: "var(--chat-text-color)" }}
                  >
                    日
                  </span>
                  <select
                    className="border rounded px-4 py-2 text-lg"
                    style={{
                      backgroundColor: "var(--chat-input-bg)",
                      borderColor: "var(--chat-input-border, #ccc)",
                    }}
                    value={value?.day || ""}
                    onChange={(e) => onChange?.({ ...value, day: e.target.value })}
                  >
                    <option value="">--</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d}日
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}


          {type === "select" && options.length > 0 && (
            <div className="flex space-x-4 mb-2">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange?.(opt);
                    onNext?.();
                  }}
                  className={`px-4 py-2 rounded-lg border font-bold transition duration-300 ${
                    value === opt
                      ? opt === "男性"
                        ? "bg-blue-500 text-white"
                        : opt === "女性"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-500 text-white"
                      : opt === "男性"
                      ? "bg-white text-gray-700 hover:bg-blue-300"
                      : opt === "女性"
                      ? "bg-white text-gray-700 hover:bg-pink-300"
                      : "bg-white text-gray-700 hover:bg-gray-300"
                  }`}

                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {type === "phoneSplit" && (
            <div className="space-y-3 mb-4"> 

              {/* 電話番号 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  電話番号 <span className="text-red-500">必須</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="090"
                    value={value?.part1 || ""}
                    onChange={(e) =>
                      onChange?.({ ...value, part1: e.target.value })
                    }
                    className="w-1/3 border border-gray-300 p-2 rounded"
                    style={{ backgroundColor: '#ffffff', color: '#000000' }}
                  />
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="0000"
                    value={value?.part2 || ""}
                    onChange={(e) =>
                      onChange?.({ ...value, part2: e.target.value })
                    }
                    className="w-1/3 border border-gray-300 p-2 rounded"
                    style={{ backgroundColor: '#ffffff', color: '#000000' }}
                  />
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="0000"
                    value={value?.part3 || ""}
                    onChange={(e) =>
                      onChange?.({ ...value, part3: e.target.value })
                    }
                    className="w-1/3 border border-gray-300 p-2 rounded"
                    style={{ backgroundColor: '#ffffff', color: '#000000' }}
                  />
                </div>
              </div>

              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  メールアドレス（空欄可）
                </label>
                <input
                  type="email"
                  placeholder="例: test@example.com"
                  value={value?.email || ""}
                  onChange={(e) =>
                    onChange?.({ ...value, email: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  style={{ backgroundColor: '#ffffff', color: '#000000' }}
                />
              </div>

            
            </div>
          )}



          
          {type !== "select" && isActive && (
            <div className="w-full flex justify-center">
              <button
                className="w-full max-w-xs relative text-white font-extrabold px-4 py-2 rounded-lg shadow-lg transition duration-300"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, var(--chat-button-from), var(--chat-button-to))",
                }}
                onClick={handleSubmit}
              >
                次へ
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-between items-center">
          {/* 編集不可状態（過去の質問履歴）表示 */}
          <p
            className="text-gray-700"
            style={{ color: "var(--chat-text-color)" }}
          >
            {value}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
