## 색인 설정

PUT https://localhost:9200/file
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
                    ]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "name": {
                "type": "text",
                "analyzer": "app_analyzer",
                "search_analyzer": "app_analyzer"
            },
            "path": {
                "type": "text",
                "analyzer": "app_analyzer",
                "search_analyzer": "app_analyzer"
            },
            "owner": {
                "type": "keyword"
            },
            "size": {
                "type": "long"
            },
            "lastModifiedTime": {
                "type": "date",
                "format": "uuuu-MM-dd'T'HH:mm:ss"
            },
            "directory": {
                "type": "boolean"
            },
            "hidden": {
                "type": "boolean"
            }
        }
    }
}
```
