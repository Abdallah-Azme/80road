import json

def find_endpoints(item):
    endpoints = []
    if isinstance(item, dict):
        if 'request' in item:
            method = item['request'].get('method', 'GET')
            url = item['request'].get('url', {})
            if isinstance(url, dict):
                raw = url.get('raw', '')
            else:
                raw = url
            endpoints.append(f"{method} {raw}")
        if 'item' in item:
            for child in item['item']:
                endpoints.extend(find_endpoints(child))
    elif isinstance(item, list):
        for i in item:
            endpoints.extend(find_endpoints(i))
    return endpoints

with open('80road.postman_collection.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

all_endpoints = find_endpoints(data)
for ep in sorted(list(set(all_endpoints))):
    print(ep)
