package com.jhelper.text;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TextSearcher {

    private TextTokenizer tokenizer;

    public TextSearcher(String text, Map<String, String> tokenOption) {
        tokenizer = new TextTokenizer(text, tokenOption);
    }

    public List<String> searchAll(TokenFilter tokenFilter) {

        List<String> tokens = new ArrayList<>();
        while (tokenizer.hasNext()) {
            String token = tokenizer.next();
            if (tokenFilter.match(token)) {
                tokens.add(token);
            }
        }

        return tokens;
    }
}
