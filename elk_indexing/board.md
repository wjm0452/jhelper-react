## 색인 설정

PUT https://localhost:9200/board
```json
{
    "settings": {
        "analysis": {
            "tokenizer": {
                "app_tokenizer": {
                    "type": "nori_tokenizer",
                    "decompound_mode": "mixed",
                    "discard_punctuation": "false"
                }
            },
            "analyzer": {
                "app_analyzer": {
                    "type": "custom",
                    "tokenizer": "app_tokenizer",
                    "filter": [
                        "lowercase",
                        "stop",
                        "trim",
                        "nori_part_of_speech"
                    ],
                    "char_filter": [
                        "html_strip"
                    ]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "id": {
                "type": "integer"
            },
            "category": {
                "type": "keyword"
            },
            "title": {
                "type": "text",
                "analyzer": "app_analyzer",
                "search_analyzer": "app_analyzer"
            },
            "content": {
                "type": "text",
                "analyzer": "app_analyzer",
                "search_analyzer": "app_analyzer"
            },
            "registerId": {
                "type": "keyword"
            },
            "registerDate": {
                "type": "date",
                "format": "uuuu-MM-dd'T'HH:mm:ss"
            }
        }
    }
}
```
