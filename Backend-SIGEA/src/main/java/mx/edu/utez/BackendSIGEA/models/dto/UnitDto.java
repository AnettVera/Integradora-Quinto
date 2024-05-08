package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.Exam;
import mx.edu.utez.BackendSIGEA.models.Subject;
import mx.edu.utez.BackendSIGEA.models.Unit;

import java.util.Set;

@NoArgsConstructor
@Setter
@Getter
public class UnitDto {

    private Long id_unit;
    private String name;
    private Set<Exam> exams;
    private Subject subject;

    public Unit toEntity(){
        return new Unit(id_unit, name);
    }



}
