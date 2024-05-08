package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.Degree;
import mx.edu.utez.BackendSIGEA.models.Exam;
import mx.edu.utez.BackendSIGEA.models.Subject;

import java.util.Set;

@NoArgsConstructor
@Setter
@Getter
public class DegreeDto {
    private Long id_degree;
    private int degree;

    public Degree toEntity() {
        return new Degree(id_degree, degree);
    }

}
