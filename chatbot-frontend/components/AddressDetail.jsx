import React from "react";
import { resolveAddress } from "../lib/api"; // API 呼び出しを行う関数

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];



const AddressDetail = ({
  address,
  onChange,
  onNext,
  editable = true,
  showNextButton = true,
}) => {
  const handlePostalCodeChange = async (e) => {
    const value = e.target.value;
    onChange("postalCode", value);

    if (/^\d{7}$/.test(value)) {
      try {
        const res = await resolveAddress(value);
        const { prefecture, city } = res.data;
        onChange("prefecture", prefecture || "");
        onChange("city", city || "");
      } catch (err) {
        console.error("住所自動補完に失敗しました", err);
        onChange("prefecture", "");
        onChange("city", "");
      }
    }
  };

  return (
    <div className="space-y-4 p-4 rounded shadow" style={{ backgroundColor: 'var(--chat-bg-color, #e5e5e5)' }}>
      {/* 郵便番号 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">郵便番号</label>
        <input
          value={address.postalCode}
          onChange={handlePostalCodeChange}
          placeholder="例: 1234567"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          style={{ backgroundColor: '#ffffff', color: '#000000' }}
          readOnly={!editable}
        />
      </div>

      {/* 都道府県 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">都道府県</label>
        <select
          value={address.prefecture}
          onChange={(e) => onChange("prefecture", e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          style={{ backgroundColor: '#ffffff', color: '#000000' }}
          disabled={!editable}
        >
          <option value="">選択してください</option>
          {prefectures.map((pref) => (
            <option key={pref} value={pref}>{pref}</option>
          ))}
        </select>
      </div>

      {/* 市区町村 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">市区町村</label>
        <input
          value={address.city}
          onChange={(e) => onChange("city", e.target.value)}
          placeholder="例: ○○市△△町"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          style={{ backgroundColor: '#ffffff', color: '#000000' }}
          readOnly={!editable}
        />
      </div>

      {/* 丁目・番地・マンション名・号室 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">丁目・番地・マンション名・号室</label>
        <input
          value={address.addressDetail}
          onChange={(e) => onChange("addressDetail", e.target.value)}
          placeholder="例: 1-2-3 ○○マンション101号室"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          style={{ backgroundColor: '#ffffff', color: '#000000' }}
          readOnly={!editable}
        />
      </div>

      {showNextButton && (
        <button
          onClick={onNext}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded mt-4"
        >
          次へ
        </button>
      )}
    </div>
  );
};

export default AddressDetail;