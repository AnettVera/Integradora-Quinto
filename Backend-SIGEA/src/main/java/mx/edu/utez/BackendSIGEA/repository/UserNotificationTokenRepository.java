package mx.edu.utez.BackendSIGEA.repository;

import mx.edu.utez.BackendSIGEA.models.UserNotificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserNotificationTokenRepository extends JpaRepository<UserNotificationToken, Long> {

    Optional<UserNotificationToken> findByToken (String token);
    @Query (value = "SELECT * FROM notification_tokens WHERE user_id = :userId", nativeQuery = true)
    List<UserNotificationToken> findAllByUserId(@Param("userId") Long userId);
}
