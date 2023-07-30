package com.jhelper.jserve.web.security;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jhelper.jserve.web.security.token.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    AuthenticationManager authenticationManager;

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, String> body,
            HttpServletRequest requset,
            HttpServletResponse response) {

        String username = body.get("username");
        String password = body.get("password");

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                username,
                password,
                AuthorityUtils.createAuthorityList("USER"));

        Authentication authentication = authenticationManager.authenticate(token);
        User user = (User) authentication.getPrincipal();

        return authResponseEntity(user);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@CookieValue("refreshToken") String refreshToken,
            HttpServletRequest requset,
            HttpServletResponse response) {

        UserDetails user = jwtTokenProvider.getUserFromToken(refreshToken);

        return authResponseEntity(user);
    }

    private ResponseEntity<?> authResponseEntity(UserDetails user) {

        String accessToken = jwtTokenProvider.createToken(user, TimeUnit.DAYS.toMillis(1));
        String refreshToken = jwtTokenProvider.createToken(user, TimeUnit.DAYS.toMillis(7));

        Map<String, Object> responseData = new HashMap<>();

        Object[] roles = user.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .toArray();

        responseData.put("username", user.getUsername());
        responseData.put("roles", roles);
        responseData.put("authenticated", true);

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .header(HttpHeaders.SET_COOKIE, ResponseCookie.from("refreshToken", refreshToken)
                        .httpOnly(true)
                        .build()
                        .toString())
                .body(responseData);
    }

    @GetMapping
    public ResponseEntity<?> authUser(@AuthenticationPrincipal UserDetails userDetails,
            @CookieValue("refreshToken") String refreshToken,
            HttpServletRequest request,
            HttpServletResponse response) {

        Map<String, Object> responseData = new HashMap<>();

        if (userDetails == null) {

            if (refreshToken != null) {
                try {
                    return refreshToken(refreshToken, request, response);
                } catch (Exception e) {
                }
            }

            responseData.put("authenticated", false);
        } else {

            Object[] roles = userDetails.getAuthorities().stream()
                    .map(authority -> authority.getAuthority())
                    .toArray();

            responseData.put("username", userDetails.getUsername());
            responseData.put("roles", roles);
            responseData.put("authenticated", true);
        }

        return ResponseEntity.ok()
                .body(responseData);
    }
}
