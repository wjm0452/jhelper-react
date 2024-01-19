package com.jhelper.jserve.config;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.ResourceUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jhelper.jserve.web.security.JsonAccessDeniedHandler;
import com.jhelper.jserve.web.security.JsonAuthenticationEntryPoint;
import com.jhelper.jserve.web.security.JwtAuthenticationFilter;
import com.jhelper.jserve.web.security.token.JwtTokenProvider;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // AuthenticationManager authenticationManager = authenticationManager(
        // http.getSharedObject(AuthenticationConfiguration.class));

        // JsonAuthenticationFilter jsonFilter = new JsonAuthenticationFilter("/login",
        // authenticationManager);
        // jsonFilter.setSecurityContextRepository(new
        // HttpSessionSecurityContextRepository());
        // jsonFilter.setAuthenticationSuccessHandler(authenticationSuccessHandler());
        // jsonFilter.setAuthenticationFailureHandler(authenticationFailureHandler());

        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter();
        jwtFilter.setTokenProvider(tokenProvider());

        http
                .sessionManagement(session -> {
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })
                .userDetailsService(users())
                .authorizeHttpRequests(
                        request -> request
                                .requestMatchers("/", "/api/auth", "/api/auth/signin", "/api/auth/refresh-token")
                                .permitAll()
                                .anyRequest().authenticated())
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exceptionHandling -> {
                    exceptionHandling.accessDeniedHandler(new JsonAccessDeniedHandler());
                    exceptionHandling.authenticationEntryPoint(new JsonAuthenticationEntryPoint());
                })
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();

        return http.getObject();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers("/index.html", "/static/**");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public UserDetailsService users() throws IOException {

        File file = ResourceUtils.getFile("data/users.json");
        System.out.println(file.getAbsolutePath());
        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, Object>> userList = objectMapper.readValue(file,
                new TypeReference<List<Map<String, Object>>>() {

                });

        List<UserDetails> users = userList.stream().map(user -> {

            String[] roles = ((List<Object>) user.get("roles")).toArray(new String[0]);

            return User.builder()
                    .username((String) user.get("username"))
                    .password((String) user.get("password"))
                    .roles(roles)
                    .build();
        }).collect(Collectors.toList());

        return new InMemoryUserDetailsManager(users);
    }

    @Bean
    public JwtTokenProvider tokenProvider() {
        return new JwtTokenProvider();
    }
}
