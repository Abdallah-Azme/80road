import json

try:
    with open('80road.postman_collection.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    endpoints = []

    def extract_endpoints(items):
        for item in items:
            if 'item' in item:
                extract_endpoints(item['item'])
            if 'request' in item:
                method = item['request'].get('method', 'GET')
                url = item['request'].get('url')
                raw = ""
                if isinstance(url, dict):
                    raw = url.get('raw', '')
                elif isinstance(url, str):
                    raw = url
                if raw:
                    endpoints.append(f"{method} {raw}")

    extract_endpoints(data['item'])

    with open('tmp/endpoints_clean.txt', 'w', encoding='utf-8') as f:
        for e in sorted(list(set(endpoints))):
            f.write(e + '\n')
    print("Done")
except Exception as e:
    print(f"Error: {e}")
