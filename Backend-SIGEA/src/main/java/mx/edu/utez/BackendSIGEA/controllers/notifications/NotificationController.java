package mx.edu.utez.BackendSIGEA.controllers.notifications;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.UserNotificationToken;
import mx.edu.utez.BackendSIGEA.models.dto.UserNotificationDto;
import mx.edu.utez.BackendSIGEA.services.notifications.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/token")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping("/{idUser}")
    public ResponseEntity<ApiResponse> saveToken(@RequestBody UserNotificationDto userNotiDto, @PathVariable Long idUser) {
        return notificationService.saveOrUpdateToken(userNotiDto.toEntity(), idUser);
    }

    @PostMapping("/send-notification/{userId}")
    public ResponseEntity<ApiResponse> sendNotifications(@PathVariable Long userId) {
        try {
            notificationService.sendNotifications(userId);
            return new  ResponseEntity<>(new ApiResponse( "Notificación enviada", HttpStatus.OK), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, "Error al enviar la notificación"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
