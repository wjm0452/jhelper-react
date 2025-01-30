package com.jhelper.jserve.config.domain;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import com.jhelper.jserve.config.ElasticConfig;
import com.jhelper.jserve.fileBrowser.properties.FileBrowserBoardProperties;

@Configuration
@EnableConfigurationProperties(FileBrowserBoardProperties.class)
public class FileConfig {

    @ConditionalOnBean(ElasticConfig.class)
    @Configuration
    static class ElasticFileSerivceConfiguration {
        // @Bean
        // public FileIndexer fileIndexer(ElalsticFileRepository elalsticFileRepository)
        // {
        // return new FileIndexer(elalsticFileRepository);
        // }

        // @Bean
        // public FileIndexScheduler
        // fileIndexScheduler(@Value("${jhelper.file-browser.rootPath}") String path,
        // FileIndexer fileIndexer) {
        // return new FileIndexScheduler(path, fileIndexer);
        // }
    }

}
