package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.*;

import java.util.Set;

@NoArgsConstructor
@Setter
@Getter
public class UserDto {

    private Long id_user;
    private String username;
    private String password;
    private boolean status;
    private Set<Role> roles;

    private Set<Exam> exams;
    private Set<OpenAnswer> openAnswers;
    private Set<MultiAnswer> multiAnswers;

    public User toEntity() {
        return new User(id_user, username, password, roles);
    }



}
