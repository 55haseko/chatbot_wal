import React from "react";


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

  return (
    <div className="bg-white shadow rounded-xl p-4 mb-4">
      <p className="text-gray-800 font-semibold mb-2 whitespace-pre-line">{question}</p>
      {isActive || editable ? (
        <div>
          {type === "text" && (
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded mb-2"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}
                    {type === "nameSplit" && (
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          placeholder="山田"
                          className="w-1/2 border border-gray-300 p-2 rounded"
                          value={value?.lastName || ""}
                          onChange={(e) => onChange?.({ ...value, lastName: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="花子"
                          className="w-1/2 border border-gray-300 p-2 rounded"
                          value={value?.firstName || ""}
                          onChange={(e) => onChange?.({ ...value, firstName: e.target.value })}
                        />
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
          value={value?.year || ""}
          onChange={(e) => onChange?.({ ...value, year: e.target.value })}
        >
          <option value="">--</option>
          {Array.from({ length: 120 }, (_, i) => 1905 + i)
            .reverse()
            .map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
        </select>
      </div>

      {/* 月 */}
      <div className="flex items-center space-x-1">
        <span className="text-gray-800">月</span>
        <select
          className="border rounded px-4 py-2 text-lg"
          value={value?.month || ""}
          onChange={(e) => onChange?.({ ...value, month: e.target.value })}
        >
          <option value="">--</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{m}月</option>
          ))}
        </select>
      </div>

      {/* 日 */}
      <div className="flex items-center space-x-1">
        <span className="text-gray-800">日</span>
        <select
          className="border rounded px-4 py-2 text-lg"
          value={value?.day || ""}
          onChange={(e) => onChange?.({ ...value, day: e.target.value })}
        >
          <option value="">--</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>{d}日</option>
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
                  className={`px-4 py-2 rounded-lg border font-bold transition ${
                    value === opt
                      ? opt === "男性"
                        ? "bg-blue-500 text-white"
                        : opt === "女性"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
          {type !== "select" && isActive && (
  <div className="w-full flex justify-center">
    <button
      className="w-full max-w-xs relative bg-gradient-to-b from-yellow-300 to-yellow-500 text-white font-extrabold px-4 py-2 rounded-lg shadow-lg hover:from-yellow-400 hover:to-yellow-600 transition duration-300"
      onClick={handleSubmit}
    >
      <span className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-lg"></span>
      次へ
    </button>
  </div>
)}




        </div>
      ) : (
        <div className="flex justify-between items-center">
          <p className="text-gray-700">{value}</p>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;