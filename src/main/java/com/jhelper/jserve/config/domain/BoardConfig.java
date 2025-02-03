package com.jhelper.jserve.config.domain;

import org.hibernate.search.mapper.pojo.standalone.mapping.SearchMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;

import com.jhelper.jserve.board.BoardService;
import com.jhelper.jserve.board.repository.BoardRepository;
import com.jhelper.jserve.board.repository.ElalsticBoardRepository;
import com.jhelper.jserve.board.service.BoardServiceImpl;
import com.jhelper.jserve.board.service.ElalsticBoardSerivce;
import com.jhelper.jserve.board.service.SearchBoardService;
import com.jhelper.jserve.config.ElasticConfig;

@Configuration
public class BoardConfig {

    @ConditionalOnBean(ElasticConfig.class)
    @Configuration
    static class ElasticBoardSerivceConfiguration {
        @Bean
        public BoardService boardService(ElasticsearchOperations elasticsearchOperations,
                ElalsticBoardRepository elalsticBoardRepository, BoardRepository boardRepository) {
            ElalsticBoardSerivce elalsticBoardSerivceImpl = new ElalsticBoardSerivce(elalsticBoardRepository,
                    elasticsearchOperations, new BoardServiceImpl(boardRepository));

            return elalsticBoardSerivceImpl;
        }
    }

    @ConditionalOnBean(SearchBoardConfig.class)
    @Configuration
    static class SearchBoardSerivceConfiguration {

        @Autowired
        private SearchMapping searchMapping;

        @Bean
        public BoardService boardService() {
            return new SearchBoardService(searchMapping);
        }
    }

    @ConditionalOnMissingBean({ ElasticConfig.class, SearchBoardConfig.class })
    @Configuration
    static class BasicboardSerivceConfiguration {
        @Bean
        public BoardService boardService(BoardRepository boardRepository) {
            return new BoardServiceImpl(boardRepository);
        }
    }
}
