엘라스틱 참고
***https://www.elastic.co/guide/en/elasticsearch/reference/7.17***

## 등록

PUT https://localhost:9200/board/_doc/1
```json
{
  "id":"1",
  "title":"안녕하세요",
  "content":"안녕하세요 내용을 입력하세요.",
  "registerId": "admin",
  "registerDate": "2025-01-17 22:16:24"
}
```

## 삭제
DELETE https://localhost:9200/board/_doc/1

## 검색

1. GET https://localhost:9200/board/_search?q=2025-01-17

2. GET https://localhost:9200/board/_search?q=title:안녕

3. GET https://localhost:9200/board/_search
```json
{
    "query": {
        "range": {
            "registerDate": {
                "gt": "2025-01-17 00:00:00"
            }
        }
    }
}
```

```json
{
    "query": {
        "bool": {
            "must": [
                { "match": { "registerId": "admin" } },
                { "match": { "title": "안녕" } }
            ],
            "filter": [
                { "range": { "registerDate": { "gt": "2025-01-17 00:00:00" } } }
            ]
        }
    }
}
```

```json
{
    "_source": {
        "excludes": [
            "content"
        ]
    },
    "from": 0,
    "query": {
        "bool": {
            "must": [
                {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "default_operator": "and",
                                    "fields": [
                                        "title"
                                    ],
                                    "query": "개발"
                                }
                            },
                            {
                                "query_string": {
                                    "default_operator": "and",
                                    "fields": [
                                        "content"
                                    ],
                                    "query": "개발"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    "size": 10,
    "sort": [
        {
            "registerDate": {
                "mode": "min",
                "order": "desc"
            }
        }
    ],
    "track_scores": false,
    "version": true
}
```
