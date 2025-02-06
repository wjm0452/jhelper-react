package com.jhelper.jserve.config;

import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.persistence.EntityManager;

@Configuration
public class SearchConfig {

    @Bean
    public SearchSession searchSession(EntityManager entityManager) {
        return Search.session(entityManager);
    }
}
