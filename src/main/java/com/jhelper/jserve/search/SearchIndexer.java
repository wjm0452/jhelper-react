package com.jhelper.jserve.search;

import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SearchIndexer implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private SearchSession searchSession;

    @Value("${jhelper.search.indexingOnLoad:false}")
    private boolean indexingOnLoad;

    @Transactional
    @Async
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if(indexingOnLoad) {
            indexing();
        }
    }

    @Transactional
    @Async
    public void indexing() {
        try {
            searchSession.massIndexer().startAndWait();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
