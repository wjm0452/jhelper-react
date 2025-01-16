package com.jhelper.jserve.web.security.token;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtTokenProvider {

        private final String secretKey = "secretsecretsecretsecretsecretsecretsecretsecretsecretsecret";

        public String createToken(UserDetails user, long timeMillis) {

                List<String> authorities = user.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .toList();

                Date tokenExpires = new Date(System.currentTimeMillis() + timeMillis);
                String token = Jwts.builder()
                                .setSubject(user.getUsername())
                                .setIssuer("jhelper")
                                .setIssuedAt(new Date())
                                .setExpiration(tokenExpires)
                                .claim("authorities", authorities)
                                .signWith(SignatureAlgorithm.HS256, secretKey)
                                .compact();

                return token;
        }

        /**
         * Claim 에서 username 가져오기
         */
        public UserDetails getUserFromToken(String token) {

                Claims claims = Jwts.parser()
                                .setSigningKey(secretKey)
                                .parseClaimsJws(token)
                                .getBody();

                String username = claims.getSubject();
                List<String> authList = claims.get("authorities", List.class);

                // 클레임에서 권한 정보 가져오기
                Collection<? extends GrantedAuthority> authorities = authList.stream()
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList());

                return User.builder()
                                .username(username)
                                .password("")
                                .authorities(authorities)
                                .build();
        }
}
