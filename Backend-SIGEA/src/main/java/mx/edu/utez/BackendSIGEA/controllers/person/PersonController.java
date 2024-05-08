package mx.edu.utez.BackendSIGEA.controllers.person;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.Role;
import mx.edu.utez.BackendSIGEA.models.User;
import mx.edu.utez.BackendSIGEA.models.dto.PersonDto;
import mx.edu.utez.BackendSIGEA.services.PersonService;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/person")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class PersonController {
    private final PersonService personService;

    @PostMapping("/saveTeacher/{idRole}")
    public ResponseEntity<ApiResponse> registerTeacher(@RequestBody PersonDto personDto, @PathVariable Long idRole) {
        return personService.savePersonRoleTeacher(personDto.toEntity(), idRole);
    }

    @PutMapping("/teacher/{id}")
    public ResponseEntity<ApiResponse> updateTeacher(@RequestBody PersonDto personDto, @PathVariable Long id) {
        return personService.updatePersonRoleTeacher(personDto.toEntity(), personDto.getUser().getUsername(), personDto.getId(), id);
    }

    @PostMapping("/saveStudent/{idRole}")
    public ResponseEntity<ApiResponse> registerStudent (@RequestBody PersonDto personDto, @PathVariable Long idRole){
        return personService.savePersonRoleStudent(personDto.toEntity(), personDto.getUser().getUsername(), idRole );
    }

    @PutMapping("/student/{idRole}")
    public ResponseEntity<ApiResponse> updateStudent(@RequestBody PersonDto personDto, @PathVariable Long idRole) {
        return personService.updatePersonRoleStudent(personDto.toEntity(), personDto.getUser().getUsername(), personDto.getId(), idRole);
    }

    @PutMapping("/admin/{idRole}")
    public ResponseEntity<ApiResponse> updateAdmin(@RequestBody PersonDto personDto, @PathVariable Long idRole) {
        return personService.updatePersonRoleAdmin(personDto.toEntity(), personDto.getId(), idRole);
    }

}
