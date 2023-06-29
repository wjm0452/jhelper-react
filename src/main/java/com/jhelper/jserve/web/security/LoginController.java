package com.jhelper.jserve.web.security;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class LoginController {

    @GetMapping("/user")
    public Map<String, Object> loginUser(@AuthenticationPrincipal UserDetails userDetails) {

        Map<String, Object> responseData = new HashMap<>();

        if (userDetails == null) {
            responseData.put("authenticated", false);
        } else {

            Object[] roles = userDetails.getAuthorities().stream()
                    .map(authority -> authority.getAuthority())
                    .toArray();

            responseData.put("username", userDetails.getUsername());
            responseData.put("roles", roles);
            responseData.put("authenticated", true);
        }

        return responseData;
    }
}
