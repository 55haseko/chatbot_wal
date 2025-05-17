import requests

def resolve_address(postal_code: str):
    """
    郵便番号(7桁)を受け取り、ZipCloud APIで住所を取得して返す。
    """
    url = f"http://zipcloud.ibsnet.co.jp/api/search?zipcode={postal_code}"
    response = requests.get(url).json()

    if response["status"] == 200 and response["results"]:
        result = response["results"][0]
        address = f"{result['address1']}{result['address2']}{result['address3']}"
        return address  # 例: "東京都新宿区西新宿"
    else:
        return None

