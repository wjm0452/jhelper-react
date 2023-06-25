package com.jhelper.jserve.web.security;

import java.io.IOException;
import java.util.Map;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    ObjectMapper objectMapper = new ObjectMapper();

    public JsonAuthenticationFilter(String defaultFilterProcessesUrl, AuthenticationManager authenticationManager) {
        super(defaultFilterProcessesUrl, authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException, IOException, ServletException {

        AuthenticationManager authenticationManager = getAuthenticationManager();
        Map body = objectMapper.readValue(request.getInputStream(), Map.class);
        String email = (String) body.get("email");
        String password = (String) body.get("password");

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                email,
                password,
                AuthorityUtils.createAuthorityList("USER"));

        return authenticationManager.authenticate(token);
    }
}
