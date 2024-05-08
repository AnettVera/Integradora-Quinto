package mx.edu.utez.BackendSIGEA.repository;

import mx.edu.utez.BackendSIGEA.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;



import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByType(String type);

    @Modifying
    @Query(value = "INSERT INTO user_roles (role_id, user_id) VALUES ( :roleId, :userId ) ",
            nativeQuery = true)
    int saveUserRole(@Param("roleId") Long roleId, @Param("userId") Long userId);

    @Query(value = "SELECT COUNT(*) FROM user_roles WHERE role_id = :roleId and user_id = :userId", nativeQuery = true)
    int existsRoleUser(@Param("roleId") Long roleId, @Param("userId") Long userId);
}
