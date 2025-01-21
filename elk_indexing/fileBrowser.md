## 색인 설정

PUT https://localhost:9200/file-browser
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
            "type": {
                "type": "keyword"
            },
            "path": {
                "type": "text",
                "analyzer": "app_analyzer",
                "search_analyzer": "app_analyzer"
            },
            "fileName": {
                "type": "text",
                "analyzer": "app_analyzer",
                "search_analyzer": "app_analyzer"
            },
            "content": {
                "type": "text",
                "analyzer": "app_analyzer",
                "search_analyzer": "app_analyzer"
            },
            "size": {
                "type": "long"
            },
            "owner": {
                "type": "keyword"
            },
            "lastModifiedTime": {
                "type": "date",
                "format": "yyyy-MM-dd HH:mm:ss"
            },
            "hidden": {
                "type": "boolean"
            }
        }
    }
}
```
