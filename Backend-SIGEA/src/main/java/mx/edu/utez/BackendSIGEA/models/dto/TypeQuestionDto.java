package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.Question;
import mx.edu.utez.BackendSIGEA.models.TypeQuestion;

import java.util.Set;

@NoArgsConstructor
@Setter
@Getter
public class TypeQuestionDto {

    private Long id_type_question;
    private String type;
    private Set<Question> question;

    public TypeQuestion toEntity() {
        return new TypeQuestion(id_type_question, type);
    }


}
