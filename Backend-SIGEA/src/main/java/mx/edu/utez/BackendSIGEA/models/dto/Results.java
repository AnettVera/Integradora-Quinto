package mx.edu.utez.BackendSIGEA.models.dto;

public interface Results {
     String getExam();
     Long getExamId();
     String getPregunta();
     Long getPreguntaId();
     String getTextoOpciones();
     String getRespuestaEstudiante();
     String getRetroalimentacion();
     String getEstadoRespuesta();
     String getCorrects();
}
