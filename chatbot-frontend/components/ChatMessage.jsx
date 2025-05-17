import React from "react";

function validateInput(key, input) {
  switch (key) {
    case "birthdate": return /^\d{4}-\d{2}-\d{2}$/.test(input);
    case "name":
    case "address":
    case "address2": return input.trim().length > 0;
    case "postalCode": return /^\d{7}$/.test(input);
    case "phone": return /^\d{10,11}$/.test(input);
    case "email": return /\S+@\S+\.\S+/.test(input);
    default: return true;
  }
}

const ChatMessage = ({
  questionObj,
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
          {type === "date" && (
            <input
              type="date"
              pattern="\\d{4}-\\d{2}-\\d{2}"
              min="1900-01-01"
              max="2099-12-31"
              className="w-full p-2 border border-gray-300 rounded mb-2"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onKeyDown={handleKeyDown}
            />
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