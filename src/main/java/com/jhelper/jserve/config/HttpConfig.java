package com.jhelper.jserve.config;

import java.util.concurrent.TimeUnit;

import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class HttpConfig {

    @Bean
    public RestTemplate restTemplate() {
        return createRestTemplate(5000, 10000, 20, 5);
    }

    private RestTemplate createRestTemplate(long connectionRequestTimeout, long responseTimeout, int maxConnTotal,
            int maxConnPerRoute) {
        HttpClient httpClient = HttpClientBuilder.create().disableCookieManagement()
                .setConnectionManager(PoolingHttpClientConnectionManagerBuilder.create().setMaxConnTotal(maxConnTotal)
                        .setMaxConnPerRoute(maxConnPerRoute).build())
                .setDefaultRequestConfig(RequestConfig.custom()
                        .setConnectionRequestTimeout(connectionRequestTimeout, TimeUnit.MILLISECONDS)
                        .setResponseTimeout(responseTimeout, TimeUnit.MILLISECONDS).build())
                .build();

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
        return new RestTemplate(factory);
    }

}
