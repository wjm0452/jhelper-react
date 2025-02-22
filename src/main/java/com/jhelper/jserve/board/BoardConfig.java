package com.jhelper.jserve.board;

import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;

import com.jhelper.jserve.board.repository.BoardRepository;
import com.jhelper.jserve.board.repository.ElalsticBoardRepository;
import com.jhelper.jserve.board.service.BoardServiceImpl;
import com.jhelper.jserve.board.service.ElalsticBoardSerivce;
import com.jhelper.jserve.board.service.SearchBoardService;
import com.jhelper.jserve.config.ElasticConfig;

@Configuration
public class BoardConfig {

    @ConditionalOnProperty(prefix = "jhelper.board", name = "searchMode", havingValue = "search")
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

    @ConditionalOnProperty(prefix = "jhelper.board", name = "searchMode", havingValue = "search")
    @ConditionalOnMissingBean({ ElasticConfig.class })
    @Configuration
    static class BasicboardSerivceConfiguration {
        @Bean
        public BoardService boardService(BoardRepository boardRepository, SearchSession searchSession) {
            return new SearchBoardService(boardRepository, searchSession);
        }
    }

    @ConditionalOnProperty(prefix = "jhelper.board", name = "searchMode", havingValue = "db", matchIfMissing = true)
    @Configuration
    static class SearchBasicboardSerivceConfiguration {
        @Bean
        public BoardService boardService(BoardRepository boardRepository) {
            return new BoardServiceImpl(boardRepository);
        }
    }
}
