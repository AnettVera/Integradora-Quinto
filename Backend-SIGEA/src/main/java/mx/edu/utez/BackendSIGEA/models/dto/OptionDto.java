package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.Option;
import mx.edu.utez.BackendSIGEA.models.QuestionOption;

import java.util.Set;

@NoArgsConstructor
@Setter
@Getter
public class OptionDto {

    private Long id_option;
    private String option;
    private Set<QuestionOption> questionOptions;

    public Option toEntity(){
        return new Option(id_option, option);
    }


}
