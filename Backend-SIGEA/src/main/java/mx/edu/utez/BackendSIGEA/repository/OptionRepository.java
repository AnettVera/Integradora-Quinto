package mx.edu.utez.BackendSIGEA.repository;

import mx.edu.utez.BackendSIGEA.models.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface OptionRepository extends JpaRepository<Option, Long> {
    @Query("SELECT o FROM Option o JOIN QuestionOption qo ON qo.option.id_option = o.id_option WHERE qo.question.id_question = :id")
    List<Option> buscar(@Param("id") Long id);



}

