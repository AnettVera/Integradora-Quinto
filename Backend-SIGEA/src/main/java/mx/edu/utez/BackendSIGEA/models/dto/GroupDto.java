package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.Exam;
import mx.edu.utez.BackendSIGEA.models.Group;
import mx.edu.utez.BackendSIGEA.models.Subject;

import java.util.Set;

@NoArgsConstructor
@Setter
@Getter
public class GroupDto {
    private Long id_group;
    private String group;
    private DegreeDto degree;
    private Set<Subject> subjects;

    public Group toEntity(){
        return new Group(id_group, group, degree.toEntity());
    }

}
