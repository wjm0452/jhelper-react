package com.jhelper.jserve.web.security;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class LoginController {

    @GetMapping("/user")
    public Map<String, Object> loginUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) authentication.getPrincipal();

        Map<String, Object> responseData = new HashMap<>();

        Object[] roles = user.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .toArray();

        responseData.put("username", user.getUsername());
        responseData.put("roles", roles);
        responseData.put("authenticated", true);

        return responseData;
    }
}
