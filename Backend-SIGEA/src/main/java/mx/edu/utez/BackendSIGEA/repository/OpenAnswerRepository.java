package mx.edu.utez.BackendSIGEA.repository;

import mx.edu.utez.BackendSIGEA.models.OpenAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OpenAnswerRepository extends JpaRepository<OpenAnswer, Long> {



    @Modifying
    @Query (value = "INSERT INTO open_answers (answer, user_id, question_id) VALUES (:answer, :userId, :questionId)", nativeQuery = true)
    int saveOpenAns(@Param("answer") String answer, @Param("userId") Long userId, @Param("questionId") Long questionId);

}
