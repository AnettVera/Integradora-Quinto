package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.Question;
import mx.edu.utez.BackendSIGEA.models.User;

@NoArgsConstructor
@Setter
@Getter
public class OpenAnswerDto {

    private Long id_open_answer;
    private String answer;
    private String feedback;
    private Question question;
    private User user;


}
