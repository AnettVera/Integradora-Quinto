package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.UserNotificationToken;

@Setter
@Getter
@NoArgsConstructor
public class UserNotificationDto {
    private Long id;
    private String token;

    public UserNotificationToken toEntity() {
        return new UserNotificationToken(id, token);
    }
}
