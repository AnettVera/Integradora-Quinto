package mx.edu.utez.BackendSIGEA.repository;

import mx.edu.utez.BackendSIGEA.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query(value = "SELECT * FROM users u JOIN user_roles ur ON u.id_user = ur.user_id " +
            "JOIN roles r ON ur.role_id = r.id_rol WHERE r.type = 'STUDENT'", nativeQuery = true)
    List <User> findAllStudents();

    @Query(value = "SELECT * FROM users u JOIN user_roles ur ON u.id_user = ur.user_id " +
            "JOIN roles r ON ur.role_id = r.id_rol WHERE r.type = 'TEACHER'", nativeQuery = true)
    List <User> findAllTeachers();

    @Modifying
    @Query(value = "INSERT INTO user_roles(user_id, role_id) " +
            "VALUES ( :userId, :roleId )", nativeQuery = true)
    int saveUserRole(Long userId, Long roleId);
    @Query(value = "SELECT user_id FROM user_roles WHERE user_id = :userId AND " +
            "role_id = :roleId ", nativeQuery = true)
    Long getIdUserRoles(Long userId, Long roleId);


    @Query(value = "SELECT DISTINCT u.* " +
            "FROM users u " +
            "JOIN ( " +
            "   SELECT oa.user_id " +
            "   FROM open_answers oa " +
            "   JOIN questions q ON oa.question_id = q.id_question " +
            "   WHERE q.exam_id = :examId " +
            "   UNION " +
            "   SELECT ma.user_id " +
            "   FROM multi_answers ma " +
            "   JOIN question_options qo ON ma.question_option_id = qo.id_question_option " +
            "   JOIN questions q ON qo.question_id = q.id_question " +
            "   WHERE q.exam_id = :examId " +
            ") AS users_answers ON u.id_user = users_answers.user_id", nativeQuery = true)
    List<User> findUsersWithAnswersInExam(Long examId);


}
