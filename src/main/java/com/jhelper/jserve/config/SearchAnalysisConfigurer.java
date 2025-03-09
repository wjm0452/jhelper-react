package com.jhelper.jserve.config;

import org.apache.lucene.analysis.ko.KoreanTokenizerFactory;
import org.hibernate.search.backend.lucene.analysis.LuceneAnalysisConfigurationContext;
import org.hibernate.search.backend.lucene.analysis.LuceneAnalysisConfigurer;

public class SearchAnalysisConfigurer implements LuceneAnalysisConfigurer {

    @Override
    public void configure(LuceneAnalysisConfigurationContext context) {
        context.analyzer("app_analyzer").custom()
        .tokenizer(KoreanTokenizerFactory.class)
        .tokenFilter("lowercase")
        .tokenFilter("stop")
        .tokenFilter("trim");
    }
}
