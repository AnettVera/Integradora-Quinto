package mx.edu.utez.BackendSIGEA.repository;

import mx.edu.utez.BackendSIGEA.models.Degree;
import mx.edu.utez.BackendSIGEA.models.Group;
import mx.edu.utez.BackendSIGEA.models.Subject;
import mx.edu.utez.BackendSIGEA.models.dto.SubjectView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByName(String name);
    Optional<Subject> findByNameAndGroup(String name, Group group);
    boolean existsByGroup(Group group);

    @Modifying
    @Query(value = "INSERT INTO user_subjects (subject_id, user_id) VALUES ( :subjectId, :userId)", nativeQuery = true)
    int saveUserSubject(@Param("subjectId") Long subjectId, @Param("userId") Long userId);

    @Query(value = "SELECT COUNT(*) FROM user_subjects WHERE subject_id = :subjectId and user_id = :userId", nativeQuery = true)
    int existsUserSubject(@Param("subjectId") Long subjectId, @Param("userId") Long userId);

    //Obtener todas las materias de un usuario por su id
    @Query(value = "SELECT s.id_subject, s.name FROM subjects s INNER JOIN user_subjects us ON s.id_subject = us.subject_id WHERE us.user_id = :userId", nativeQuery = true)
    List<SubjectView> findAllByUserId(@Param("userId") Long userId);

}
