package com.jhelper.jserve.config.domain;

import org.hibernate.search.mapper.pojo.mapping.definition.annotation.AnnotatedTypeSource;
import org.hibernate.search.mapper.pojo.mapping.definition.programmatic.ProgrammaticMappingConfigurationContext;
import org.hibernate.search.mapper.pojo.mapping.definition.programmatic.TypeMappingStep;
import org.hibernate.search.mapper.pojo.standalone.mapping.SearchMapping;
import org.hibernate.search.mapper.pojo.standalone.mapping.StandalonePojoMappingConfigurationContext;
import org.hibernate.search.mapper.pojo.standalone.mapping.StandalonePojoMappingConfigurer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.jhelper.jserve.board.entity.SearchBoard;

@ConditionalOnProperty(prefix = "jhelper.board", name = "search")
@Configuration
public class SearchBoardConfig implements StandalonePojoMappingConfigurer {

    @Value("${hibernate.search.backend.directory.root}")
    private String rootDirectory;

    @Override
    public void configure(StandalonePojoMappingConfigurationContext context) {
        ProgrammaticMappingConfigurationContext mappingContext = context.programmaticMapping();
        TypeMappingStep bookMapping = mappingContext.type(SearchBoard.class);
        bookMapping.searchEntity();
        bookMapping.indexed();
    }

    @Bean
    public SearchMapping getSearchMapping() {
        return SearchMapping.builder(AnnotatedTypeSource.fromClasses(SearchBoard.class))
                .property("hibernate.search.backend.type", "lucene")
                .property("hibernate.search.backend.directory.type", "local-filesystem")
                .property("hibernate.search.backend.directory.root", rootDirectory).build();
    }
}
