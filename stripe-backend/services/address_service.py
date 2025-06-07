import requests

def resolve_address(postal_code: str):
    """
    郵便番号(7桁)を受け取り、ZipCloud APIで住所を取得して返す。
    都道府県と市区町村を分けた辞書形式で返す。
    """
    url = f"http://zipcloud.ibsnet.co.jp/api/search?zipcode={postal_code}"
    response = requests.get(url).json()

    if response["status"] == 200 and response["results"]:
        result = response["results"][0]
        prefecture = result["address1"]  # 都道府県
        city = f"{result['address2']}{result['address3']}"  # 市区町村・町域
        return {
            "prefecture": prefecture,
            "city": city
        }
    else:
        return None
