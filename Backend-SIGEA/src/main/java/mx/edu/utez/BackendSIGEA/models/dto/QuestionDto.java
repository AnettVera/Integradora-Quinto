package mx.edu.utez.BackendSIGEA.models.dto;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.*;

import java.util.Set;

@NoArgsConstructor
@Setter
@Getter
public class QuestionDto {

    private Long id_question;
    private Float score;
    private String question;
    private TypeQuestion typeQuestion;
    private Exam exam;
    private Set<OpenAnswer> openAnswer;
    private Set<QuestionOption> questionOption;

    public Question toEntity(){
        return new Question(id_question ,question, score, typeQuestion.getId_type_question());
    }


}
