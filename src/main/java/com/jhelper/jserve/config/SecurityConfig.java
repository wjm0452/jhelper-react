package com.jhelper.jserve.config;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.util.ResourceUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jhelper.jserve.web.security.JsonAuthenticationFailureHandler;
import com.jhelper.jserve.web.security.JsonAuthenticationFilter;
import com.jhelper.jserve.web.security.JsonAuthenticationSuccessHandler;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.apply(new CustomDsl());

        http
                .sessionManagement(session -> {
                    session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED);
                })
                .userDetailsService(users())
                .authorizeHttpRequests(
                        request -> request
                                .requestMatchers("/", "/login").permitAll()
                                .anyRequest().authenticated())
                .csrf(csrf -> csrf.disable())
                .build();

        return http.getObject();
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

        File file = ResourceUtils.getFile("users.json");
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

    public static class CustomDsl extends AbstractHttpConfigurer<CustomDsl, HttpSecurity> {
        @Override
        public void configure(HttpSecurity http) throws Exception {

            AuthenticationManager authenticationManager = http.getSharedObject(AuthenticationManager.class);

            JsonAuthenticationFilter jsonFilter = new JsonAuthenticationFilter("/login", authenticationManager);
            jsonFilter.setSecurityContextRepository(new HttpSessionSecurityContextRepository());
            jsonFilter.setAuthenticationSuccessHandler(new JsonAuthenticationSuccessHandler());
            jsonFilter.setAuthenticationFailureHandler(new JsonAuthenticationFailureHandler());

            http.addFilterBefore(jsonFilter, UsernamePasswordAuthenticationFilter.class);
        }
    }
}
