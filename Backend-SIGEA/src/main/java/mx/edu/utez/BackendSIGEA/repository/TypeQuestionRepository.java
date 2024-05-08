package mx.edu.utez.BackendSIGEA.repository;

import mx.edu.utez.BackendSIGEA.models.TypeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TypeQuestionRepository extends JpaRepository<TypeQuestion, Long> {
    Optional<TypeQuestion> findByType(String type);
}
