package mx.edu.utez.BackendSIGEA.repository;

import mx.edu.utez.BackendSIGEA.models.Option;
import mx.edu.utez.BackendSIGEA.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

import java.util.Set;

public interface QuestionRepository  extends JpaRepository<Question, Long> {

    @Query (value = "SELECT e.cuantity FROM exams e WHERE e.id_exam = :id_exam", nativeQuery = true)
    Integer findCuantity(Long id_exam);

    @Query("select q from Question q WHERE q.exam.id_exam = :id ")
    Set<Question> findByExamId_exam(@Param("id") Long id);



}
