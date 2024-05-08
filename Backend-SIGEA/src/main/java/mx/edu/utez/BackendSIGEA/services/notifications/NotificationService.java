package mx.edu.utez.BackendSIGEA.services.notifications;

import com.google.gson.JsonObject;
import lombok.*;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.User;
import mx.edu.utez.BackendSIGEA.models.UserNotificationToken;
import mx.edu.utez.BackendSIGEA.repository.UserNotificationTokenRepository;
import mx.edu.utez.BackendSIGEA.repository.UserRepository;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {

    private final UserRepository userRepository;
    private final UserNotificationTokenRepository userNotificationTokenRepository;

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> saveOrUpdateToken(UserNotificationToken useNotTkn, Long idUser) {
        Optional<User> foundUser = userRepository.findById(idUser);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            Optional<UserNotificationToken> existingToken = userNotificationTokenRepository.findByToken(useNotTkn.getToken());

            if (existingToken.isPresent()) {

                UserNotificationToken tokenToUpdate = existingToken.get();
                tokenToUpdate.setToken(useNotTkn.getToken());
                userNotificationTokenRepository.save(tokenToUpdate);

            } else {

                useNotTkn.setUser(user);
                userNotificationTokenRepository.saveAndFlush(useNotTkn);
            }

            return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, true, "Token saved or updated successfully"), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "User not found"), HttpStatus.NOT_FOUND);
    }

    @Async
    public void sendNotifications(Long userId) {
        RestTemplate restTemplate = new RestTemplate();
        List<UserNotificationToken> tokens = userNotificationTokenRepository.findAllByUserId(userId);
        for (UserNotificationToken token : tokens) {
            String expoToken = token.getToken();
            System.out.println("Enviando notificación a: " + expoToken);

            // Construir el cuerpo de la notificación
            Notification notification = new Notification();
            notification.setTo(expoToken);
            notification.setTitle("Examen calificado");
            notification.setBody("Revisa tu historial para ver la calificación");


            // Enviar la notificación a Expo
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Host", "exp.host");
            headers.set("Content-Type", "application/json");
            headers.set("Accept", "application/json");
            headers.set("Accept-Encoding", "gzip, deflate");

            HttpEntity<Notification> entity = new HttpEntity<>(notification, headers);
            restTemplate.postForObject(
                    "https://exp.host/--/api/v2/push/send",
                    entity,
                    String.class
            );
        }
    }

    @Data
    class Notification {
        String to;
        String title;
        String body;
    }
}
