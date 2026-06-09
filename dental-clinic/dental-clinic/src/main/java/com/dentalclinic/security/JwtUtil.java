package com.dentalclinic.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long ACCESS_EXPIRATION = 1000 * 60 * 60;
    private final long REFRESH_EXPIRATION = 1000 * 60 * 60 * 24 * 7;

    public String generateAccessToken(Long userId, String role, String subject) {
        return Jwts.builder()
                .subject(subject)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION))
                .signWith(SECRET_KEY)
                .compact();
    }

    public String generateRefreshToken(Long userId, String role, String subject) {
        return Jwts.builder()
                .subject(subject)
                .claim("userId", userId)
                .claim("role", role)
                .claim("type", "refresh")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION))
                .signWith(SECRET_KEY)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Long getUserId(String token) {
        return extractClaims(token).get("userId", Long.class);
    }

    public String getRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public String getSubject(String token) {
        return extractClaims(token).getSubject();
    }
}