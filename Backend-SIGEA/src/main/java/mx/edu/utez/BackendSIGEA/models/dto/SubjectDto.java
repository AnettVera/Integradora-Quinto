package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.Subject;
import mx.edu.utez.BackendSIGEA.models.Unit;

import java.util.Set;

@NoArgsConstructor
@Setter
@Getter
public class SubjectDto {

    private Long id_subject;
    private String name;
    private boolean status;
    private GroupDto group;
    private Set<Unit> units;

    public Subject toEntity(){
        return new Subject(id_subject, name, group.toEntity() );
    }
}
