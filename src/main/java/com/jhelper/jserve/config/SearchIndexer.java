package com.jhelper.jserve.config;

import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

@Component
public class SearchIndexer implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private EntityManager entityManager;

    @Override
    @Transactional
    @Async
    public void onApplicationEvent(ContextRefreshedEvent event) {
        SearchSession searchSession = Search.session(entityManager);

        // MassIndexer indexer =
        // searchSession.massIndexer(Book.class).threadsToLoadObjects(7);
        try {
            searchSession.massIndexer().startAndWait();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

    }

}
