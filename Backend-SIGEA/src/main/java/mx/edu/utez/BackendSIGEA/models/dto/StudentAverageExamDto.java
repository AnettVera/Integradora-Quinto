package mx.edu.utez.BackendSIGEA.models.dto;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class StudentAverageExamDto {

    private Long idStudentAverage;
    private String averageStudent;
    private UserDto user;
    private ExamDto exam;
}
