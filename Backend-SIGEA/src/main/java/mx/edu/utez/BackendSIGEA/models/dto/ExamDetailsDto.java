package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class ExamDetailsDto {
    private Long idExam;
    private String examName;
    private Long idQuestion;
    private String question;
    private String questionType; // Nuevo campo para el tipo de pregunta
    private String options;
}
