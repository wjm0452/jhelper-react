package com.jhelper.jserve.fileBrowser.repository;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.jhelper.jserve.config.ElasticConfig;
import com.jhelper.jserve.fileBrowser.entity.FileDocument;

@ConditionalOnBean(ElasticConfig.class)
public interface ElalsticFileRepository extends ElasticsearchRepository<FileDocument, String> {
}
