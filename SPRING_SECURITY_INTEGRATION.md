# Spring Security Integration Guide

This document outlines the Spring Security integration implemented in the Next.js frontend application.

## Frontend Implementation

### 1. Authentication System (`src/lib/auth.ts`)

The authentication system provides simple integration with Spring Security:

- **Login**: Sends credentials to `/api/auth/login` endpoint
- **Logout**: Calls `/api/auth/logout` endpoint
- **Session Check**: Validates session with `/api/auth/me` endpoint
- **Local Storage**: Stores user info and authentication state

### 2. API Integration (`src/lib/api.ts`)

All API requests now include:
- `credentials: 'include'` for session cookie handling
- Automatic redirect to login on 401/403 responses
- Session cleanup on authentication errors

### 3. Updated Components

- **Login Form**: Now calls real Spring Security endpoints
- **App Layout**: Validates session with backend on load
- **User Navigation**: Shows current user info and proper logout
- **Middleware**: Basic route protection (client-side focused)

## Spring Boot Backend Implementation

### 1. Authentication Controller (`com.pension.controller.AuthController`)

```java
package com.pension.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Create session explicitly to ensure it exists
            HttpSession session = httpRequest.getSession(true);

            var userDto = new UserDto(
                authentication.getName(),
                authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList())
            );

            return ResponseEntity.ok(userDto);
        } catch (Exception ex) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        var userDto = new UserDto(
            authentication.getName(),
            authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList())
        );

        return ResponseEntity.ok(userDto);
    }

    // DTOs

    public static class LoginRequest {
        private String username;
        private String password;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class UserDto {
        private String username;
        private List<String> roles;

        public UserDto(String username, List<String> roles) {
            this.username = username;
            this.roles = roles;
        }
        public String getUsername() { return username; }
        public List<String> getRoles() { return roles; }
    }
}
```

### 2. Security Configuration (`com.pension.config.SecurityConfig`)

```java
package com.pension.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login", "/api/auth/logout").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable()) // disable default login page
            .httpBasic(basic -> basic.disable()); // disable basic auth

        return http.build();
    }

    // CORS config allowing Next.js frontend
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:9002",  // Default Next.js port
            "http://localhost:9002"   // Alternative port
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Expose AuthenticationManager for AuthController injection
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
```

### 3. User Details Configuration (`com.pension.config.UserDetailsConfig`)

```java
package com.pension.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class UserDetailsConfig {

    @Bean
    public InMemoryUserDetailsManager userDetailsService(PasswordEncoder encoder) {
        UserDetails user = User.withUsername("user")
                .password(encoder.encode("password"))
                .roles("USER")
                .build();

        UserDetails admin = User.withUsername("admin")
                .password(encoder.encode("admin123"))
                .roles("ADMIN", "USER")
                .build();

        return new InMemoryUserDetailsManager(user, admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## Key Features

1. **Session-Based Authentication**: Uses HTTP sessions instead of JWT tokens
2. **CORS Support**: Configured to allow credentials from Next.js frontend
3. **Automatic Session Validation**: Checks session validity on app load
4. **Graceful Error Handling**: Redirects to login on authentication failures
5. **User Context**: Displays current user information in the UI

## Security Considerations

- Sessions are managed by Spring Security
- Cookies are used for session persistence
- CORS is configured to allow credentials
- All API endpoints (except auth) require authentication
- Client-side authentication state is synchronized with server

## Testing the Integration

1. Start your Spring Boot application with the security configuration
2. Start the Next.js application (`npm run dev`)
3. Navigate to `http://localhost:9002`
4. You should be redirected to `/login`
5. Enter valid credentials configured in your Spring Security
6. Upon successful login, you'll be redirected to the dashboard
7. All API calls will include session cookies automatically

## Troubleshooting

- **CORS Issues**: Ensure your Spring Boot CORS configuration allows `http://localhost:9002` with credentials
- **Session Issues**: Check that your Spring Security is configured for session management
- **Login Failures**: Verify the `/api/auth/login` endpoint returns user information on success
- **API Failures**: Ensure all protected endpoints require authentication in Spring Security