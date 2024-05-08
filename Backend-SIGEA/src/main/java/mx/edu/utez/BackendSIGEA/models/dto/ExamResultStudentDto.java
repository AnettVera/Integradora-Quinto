package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class ExamResultStudentDto {

    private String nombreExamen;
    private Long examId;
    private String pregunta;
    private Long preguntaId;
    private String textoOpciones;
    private String respuestaEstudiante;
    private String retroalimentacion;
    private String estadoRespuesta;
    private String opcionesCorrectasSiIncorrecta;
}
