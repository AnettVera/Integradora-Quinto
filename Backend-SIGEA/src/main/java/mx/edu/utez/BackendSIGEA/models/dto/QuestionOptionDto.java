package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.MultiAnswer;
import mx.edu.utez.BackendSIGEA.models.Option;
import mx.edu.utez.BackendSIGEA.models.Question;
import mx.edu.utez.BackendSIGEA.models.QuestionOption;

import java.util.Set;

@NoArgsConstructor
@Setter
@Getter
public class QuestionOptionDto {

    private Long id_question_option;
    private boolean correct;
    private Question question;
    private Option option;
    private Set<MultiAnswer> multiAnswers;

    public QuestionOption toEntity(){
        return new QuestionOption(id_question_option, correct, question);
    }
}
