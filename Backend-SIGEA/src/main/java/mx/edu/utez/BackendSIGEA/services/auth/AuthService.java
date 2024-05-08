package mx.edu.utez.BackendSIGEA.services.auth;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.controllers.auth.dto.SignedDto;
import mx.edu.utez.BackendSIGEA.models.User;
import mx.edu.utez.BackendSIGEA.security.jwt.JwtProvider;
import mx.edu.utez.BackendSIGEA.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> signIn(String username, String password) {
        try {
            Optional<User> foundUser = userService.findUserByUsername(username);
            if (foundUser.isEmpty())
                return new ResponseEntity<>(
                        new ApiResponse(HttpStatus.NOT_FOUND, true, "UserNotFound"),
                        HttpStatus.BAD_REQUEST);
            User user = foundUser.get();
            if (!user.getStatus())
                return new ResponseEntity<>(
                        new ApiResponse(HttpStatus.UNAUTHORIZED, true, "Inactive"),
                        HttpStatus.BAD_REQUEST);
            if (!user.getBlocked())
                return new ResponseEntity<>(
                        new ApiResponse(HttpStatus.UNAUTHORIZED, true, "Blocked"),
                        HttpStatus.BAD_REQUEST);

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            SecurityContextHolder.getContext().setAuthentication(auth);
            String token = jwtProvider.generateToken(auth);
            SignedDto signedDto = new SignedDto(token, "Bearer", user, user.getRoles().stream().toList());
            return new ResponseEntity<>(
                    new ApiResponse(signedDto, HttpStatus.OK),
                    HttpStatus.OK
            );
        } catch (Exception e) {
            String message = "Credentials Missmatch";
            if (e instanceof DisabledException)
                message = "User is disabled";
            return new ResponseEntity<>(
                    new ApiResponse(HttpStatus.UNAUTHORIZED, true, message),
                    HttpStatus.UNAUTHORIZED);
        }
    }
}
