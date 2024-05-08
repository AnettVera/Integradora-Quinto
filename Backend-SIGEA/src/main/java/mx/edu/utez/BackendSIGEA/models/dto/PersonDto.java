package mx.edu.utez.BackendSIGEA.models.dto;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.Person;
import mx.edu.utez.BackendSIGEA.models.Role;
import mx.edu.utez.BackendSIGEA.models.User;

@NoArgsConstructor
@Setter
@Getter
public class PersonDto {
    private Long id;
    private String name;
    private String secondName;
    private String lastname;
    private String surname;
    private String email;
    private String curp;
    private UserDto user;
    private Role role;

    public Person toEntity() {
        return new Person(id, name, secondName, lastname, surname, email, curp, user.toEntity());
    }


}
