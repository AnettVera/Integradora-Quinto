package mx.edu.utez.BackendSIGEA.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtProvider {
    private final Logger LOGGER = LoggerFactory.getLogger(JwtProvider.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private final String HEADER = "Authentication";
    private final String TOKEN_TYPE = "Bearer ";

    public String generateToken(Authentication auth){
        UserDetails user = (UserDetails) auth.getPrincipal();
        ClaimsBuilder claims = Jwts.claims().subject(user.getUsername());
        claims.add("roles", user.getAuthorities());
        Date tokenCreateTime = new Date();
        Date tokenExpirationTime = new Date(tokenCreateTime.getTime() + expiration * 1000);
        return Jwts.builder()
                .setClaims(claims.build())
                .setIssuedAt(tokenCreateTime)
                .setExpiration(tokenExpirationTime)
                .signWith(getSignKey() ,SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims parseClaims(String token){
        return Jwts.parser().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody();
    }

    public Claims resolveClaims(HttpServletRequest request){
        try{
            String token = resolveToken(request);
            if(token != null)
                return parseClaims(token);
            return null;
        } catch (ExpiredJwtException e){
            request.setAttribute("Invalid", e.getMessage());
            throw e;
        } catch (Exception e){
            request.setAttribute("Invalid", e.getMessage());
            throw e;
        }
    }

    public String resolveToken(HttpServletRequest request){
        String bearerToken = request.getHeader(HEADER);
        if(bearerToken != null && bearerToken.startsWith(TOKEN_TYPE))
            return bearerToken.substring(TOKEN_TYPE.length());
        return null;
    }

    public boolean validateClaims(Claims claims, String token){
        try{
            parseClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (MalformedJwtException e){
            LOGGER.error("Invalid token");
        }catch (UnsupportedJwtException e){
            LOGGER.error("Unsupported token");
        }catch (ExpiredJwtException e) {
            LOGGER.error("Expired token");
        }catch (IllegalArgumentException e) {
            LOGGER.error("Empty token");
        }
        return false;
    }

}
