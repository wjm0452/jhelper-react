package com.jhelper.jserve.board.repository;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.jhelper.jserve.board.entity.BoardDocument;
import com.jhelper.jserve.config.ElasticConfig;

@ConditionalOnBean(ElasticConfig.class)
public interface ElalsticBoardRepository extends ElasticsearchRepository<BoardDocument, Integer> {
}
