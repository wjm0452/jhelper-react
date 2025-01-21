package com.jhelper.jserve.config;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.List;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.hc.client5.http.ssl.NoopHostnameVerifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.elasticsearch.ElasticsearchProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@ConditionalOnProperty(prefix = "spring.elasticsearch", name = "username")
@Configuration
@EnableElasticsearchRepositories
public class ElasticConfig extends ElasticsearchConfiguration {

    @Autowired
    ElasticsearchProperties elasticsearchProperties;

    @Override
    public ClientConfiguration clientConfiguration() {

        List<String> uris = elasticsearchProperties.getUris();

        String[] hosts = uris.stream().map(uri -> {

            if (uri.startsWith("https://")) {
                return uri.substring("https://".length());
            }
            if (uri.startsWith("http://")) {
                return uri.substring("http://".length());
            }
            return uri;

        }).toArray(size -> new String[size]);

        return ClientConfiguration.builder().connectedTo(hosts)
                .usingSsl(disableSslVerification(), NoopHostnameVerifier.INSTANCE)
                .withBasicAuth(elasticsearchProperties.getUsername(), elasticsearchProperties.getPassword()).build();
    }

    public static SSLContext disableSslVerification() {

        try {
            // SSLContext 생성
            SSLContext sslContext = SSLContext.getInstance("TLS");

            // TrustManager 생성 (인증서 검증을 하지 않음)
            TrustManager[] trustAllCertificates = new TrustManager[] { new X509TrustManager() {
                public X509Certificate[] getAcceptedIssuers() {
                    return null;
                }

                public void checkClientTrusted(X509Certificate[] certs, String authType) {
                    // 인증서 검증을 하지 않음
                }

                public void checkServerTrusted(X509Certificate[] certs, String authType) {
                    // 인증서 검증을 하지 않음
                }
            } };

            // SSLContext에 TrustManager 설정
            sslContext.init(null, trustAllCertificates, new java.security.SecureRandom());
            return sslContext;
        } catch (NoSuchAlgorithmException | KeyManagementException e) {
            throw new RuntimeException(e);
        }
    }
}
