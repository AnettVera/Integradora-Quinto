package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.MultiAnswer;
import mx.edu.utez.BackendSIGEA.models.QuestionOption;
import mx.edu.utez.BackendSIGEA.models.User;

@NoArgsConstructor
@Setter
@Getter
public class MultiAnswerDto {
    private Long id_multi_answer;
    private User user;
    private QuestionOption questionOption;

    public MultiAnswer toEntity(){
        return  new MultiAnswer(id_multi_answer,user,questionOption);
    }

}
