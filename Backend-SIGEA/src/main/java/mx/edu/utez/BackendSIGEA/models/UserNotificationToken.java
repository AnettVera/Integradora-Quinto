package mx.edu.utez.BackendSIGEA.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "notification_tokens")
@NoArgsConstructor
@Setter
@Getter
public class UserNotificationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String token;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties(value = {"userNotificationTokens"})
    private User user;

    public UserNotificationToken(Long id, String token) {
        this.id = id;
        this.token = token;
    }
}
