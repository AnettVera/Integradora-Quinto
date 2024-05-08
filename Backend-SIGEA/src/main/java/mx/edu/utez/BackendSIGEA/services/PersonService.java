package mx.edu.utez.BackendSIGEA.services;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.Person;
import mx.edu.utez.BackendSIGEA.models.Role;
import mx.edu.utez.BackendSIGEA.models.User;
import mx.edu.utez.BackendSIGEA.repository.PersonRepository;
import mx.edu.utez.BackendSIGEA.repository.RoleRepository;
import mx.edu.utez.BackendSIGEA.repository.UserRepository;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PersonService {
    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findAll() {
        return new ResponseEntity<>(
                new ApiResponse(personRepository.findAll(), HttpStatus.OK),
                HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        Optional<Person> foundPerson = personRepository.findById(id);
        if (foundPerson.isPresent())
            return new ResponseEntity<>(new ApiResponse(foundPerson.get(), HttpStatus.OK), HttpStatus.OK);
        return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "RecordNotFound"), HttpStatus.NOT_FOUND);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> savePersonRoleTeacher(Person person, Long roleId) {
        person.setStatus(true);

        String curp = person.getCurp().toUpperCase();
        person.setCurp(curp);

        Optional<Person> foundCurp = personRepository.findByCurp(person.getCurp());
        if (foundCurp.isPresent())
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RecordAlreadyExistCurp"),
                    HttpStatus.BAD_REQUEST);

        String username = (person.getName() + "_" + person.getLastname()).toLowerCase();
        Optional<User> foundUser = userRepository.findByUsername(username);

        if (foundUser.isPresent()) { // Si el usuario ya existe entra al if // true
            // Validar si el usuario tiene segundo nombre
            if (person.getSecondName() != null) {
                username = (person.getSecondName() + "_" + person.getLastname()).toLowerCase();
                foundUser = userRepository.findByUsername(username);

                if (foundUser.isPresent()) {
                    // Validar si el usuario tiene segundo apellido
                    if (person.getSurname() != null) {
                        username = (person.getSecondName() + "_" + person.getSurname()).toLowerCase();
                        foundUser = userRepository.findByUsername(username);

                        if (foundUser.isPresent()) {

                            // Validar si el usuario tiene segundo apellido
                            if (person.getSurname() != null) {
                                System.out.println(person.getSurname());
                                username = (person.getName() + "_" + person.getSurname()).toLowerCase();
                                foundUser = userRepository.findByUsername(username);

                                if (foundUser.isPresent()) {
                                    return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RecordAlreadyExist3"),
                                            HttpStatus.BAD_REQUEST);
                                }
                            }
                        }
                    } else {
                        // El usuario no tiene segundo apellido
                        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RecordAlreadyExist2"),
                                HttpStatus.BAD_REQUEST);
                    }
                }
            } else {
                // Validar si el usuario tiene segundo apellido
                if (person.getSurname() != null) {
                    System.out.println(person.getSurname());
                    username = (person.getName() + "_" + person.getSurname()).toLowerCase();
                    foundUser = userRepository.findByUsername(username);

                    if (foundUser.isPresent()) {
                        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RecordAlreadyExist3"),
                                HttpStatus.BAD_REQUEST);
                    }
                } else {
                    // El usuario no tiene segundo nombre ni segundo apellido
                    return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RecordAlreadyExist4"),
                            HttpStatus.BAD_REQUEST);
                }
            }
        }

        person.getUser().setUsername(username);
        String pass=(username + person.getCurp().substring(person.getCurp().length() - 3)).toLowerCase();
        String password = passwordEncoder.encode(pass);
        person.getUser().setPassword(password);

        person.getUser().setPassword(password);
        person.getUser().setPerson(person);
        person.getUser().setRoles(null);
        person = personRepository.saveAndFlush(person);
        User savedUser = person.getUser();
        if (roleRepository.saveUserRole(roleId, savedUser.getId_user()) <= 0)
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RoleNotAttached"),
                    HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(new ApiResponse(person, HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> savePersonRoleStudent(Person person, String username, Long roleId) {
        person.setStatus(true);
        String curp = person.getCurp().toUpperCase();
        person.setCurp(curp);
        Optional<Person> foundCurp = personRepository.findByCurp(person.getCurp());
        if (foundCurp.isPresent())
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RecordAlreadyExist"),
                    HttpStatus.BAD_REQUEST);
        Optional<User> foundUsername = userRepository.findByUsername(username);
        if (foundUsername.isPresent())
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RecordAlreadyExist"),
                    HttpStatus.BAD_REQUEST);
        person.getUser().setUsername(username);
        String pass=(username + person.getCurp().substring(person.getCurp().length() - 3)).toLowerCase();
        String password = passwordEncoder.encode(pass);
        person.getUser().setPassword(password);
        person.getUser().setPerson(person);
        person.getUser().setRoles(null);
        person = personRepository.saveAndFlush(person);
        User savedUser = person.getUser();
        if (roleRepository.saveUserRole(roleId, savedUser.getId_user()) <= 0)
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RoleNotAttached"),
                    HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(new ApiResponse(person, HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> updatePersonRoleTeacher(Person updatedPerson, String updatedUsername, Long personId, Long roleId) {
        Optional<Person> foundPerson = personRepository.findById(personId);
        if (foundPerson.isPresent()) {
            Person updatePerson = foundPerson.get();

            String currentUsername = updatePerson.getUser().getUsername();
            if (!currentUsername.equals(updatedUsername)) {
                Optional<User> foundUser = userRepository.findByUsername(updatedUsername);
                if (foundUser.isPresent())
                    return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RecordAlreadyExist"),
                            HttpStatus.BAD_REQUEST);
            }

            updatePerson.setName(updatedPerson.getName());
            updatePerson.setSecondName(updatedPerson.getSecondName());
            updatePerson.setLastname(updatedPerson.getLastname());
            updatePerson.setSurname(updatedPerson.getSurname());
            updatePerson.setCurp(updatedPerson.getCurp().toUpperCase());
            updatePerson.setEmail(updatedPerson.getEmail());
            updatePerson.setStatus(updatedPerson.getStatus());


            User user = updatePerson.getUser();
            user.setUsername(updatedUsername);
            if(!updatedPerson.getUser().getPassword().isEmpty()){

                user.setPassword(passwordEncoder.encode(updatedPerson.getUser().getPassword()));


                if (roleRepository.existsRoleUser(roleId, user.getId_user()) == 0) {
                    if (roleRepository.saveUserRole(roleId, user.getId_user()) <= 0)
                        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RoleNotAttached"),
                                HttpStatus.BAD_REQUEST);
                }


                return new ResponseEntity<>(new ApiResponse(personRepository.saveAndFlush(updatePerson), HttpStatus.OK), HttpStatus.OK);
            }else{
                if (roleRepository.existsRoleUser(roleId, user.getId_user()) == 0) {
                    if (roleRepository.saveUserRole(roleId, user.getId_user()) <= 0)
                        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RoleNotAttached"),
                                HttpStatus.BAD_REQUEST);
                }


                return new ResponseEntity<>(new ApiResponse(personRepository.saveAndFlush(updatePerson), HttpStatus.OK), HttpStatus.OK);
            }

        }
        return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "RecordNotFound"), HttpStatus.NOT_FOUND);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> updatePersonRoleStudent(Person updatedPerson, String updatedUsername, Long personId, Long roleId) {
        Optional<Person> foundPerson = personRepository.findById(personId);
        if (foundPerson.isPresent()) {
            Person updatePerson = foundPerson.get();
            String currentUsername = updatePerson.getUser().getUsername();
            if (!currentUsername.equals(updatedUsername)) {
                Optional<User> foundUser = userRepository.findByUsername(updatedUsername);
                if (foundUser.isPresent())
                    return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RecordAlreadyExist"),
                            HttpStatus.BAD_REQUEST);
            }

            updatePerson.setName(updatedPerson.getName());
            updatePerson.setSecondName(updatedPerson.getSecondName());
            updatePerson.setLastname(updatedPerson.getLastname());
            updatePerson.setSurname(updatedPerson.getSurname());
            updatePerson.setCurp(updatedPerson.getCurp().toUpperCase());
            updatePerson.setEmail(updatedPerson.getEmail());
            updatePerson.setStatus(updatedPerson.getStatus());

            User user = updatePerson.getUser();
            user.setUsername(updatedUsername);
            if(!updatedPerson.getUser().getPassword().isEmpty()){

                user.setPassword(passwordEncoder.encode(updatedPerson.getUser().getPassword()));

                if (roleRepository.existsRoleUser(roleId, user.getId_user()) == 0) {
                    if (roleRepository.saveUserRole(roleId, user.getId_user()) <= 0)
                        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RoleNotAttached"),
                                HttpStatus.BAD_REQUEST);
                }

                return new ResponseEntity<>(new ApiResponse(personRepository.saveAndFlush(updatePerson), HttpStatus.OK), HttpStatus.OK);
            }else{

                if (roleRepository.existsRoleUser(roleId, user.getId_user()) == 0) {
                    if (roleRepository.saveUserRole(roleId, user.getId_user()) <= 0)
                        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RoleNotAttached"),
                                HttpStatus.BAD_REQUEST);
                }

                return new ResponseEntity<>(new ApiResponse(personRepository.saveAndFlush(updatePerson), HttpStatus.OK), HttpStatus.OK);
            }

        }
        return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "RecordNotFound"), HttpStatus.NOT_FOUND);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> updatePersonRoleAdmin(Person updatedPerson, Long personId, Long roleId) {
        Optional<Person> foundPerson = personRepository.findById(personId);

        if (foundPerson.isPresent()) {
            Person updatePerson = foundPerson.get();

            String updatedUsername = updatedPerson.getUser().getUsername();
            String currentUsername = updatePerson.getUser().getUsername();

            if (!currentUsername.equals(updatedUsername)) {
                Optional<User> foundUser = userRepository.findByUsername(updatedUsername);
                if (foundUser.isPresent())
                    return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RecordAlreadyExist"),
                            HttpStatus.BAD_REQUEST);
            }
            updatePerson.setName(updatedPerson.getName());
            updatePerson.setSecondName(updatedPerson.getSecondName());
            updatePerson.setLastname(updatedPerson.getLastname());
            updatePerson.setSurname(updatedPerson.getSurname());
            updatePerson.setCurp(updatedPerson.getCurp().toUpperCase());
            updatePerson.setEmail(updatedPerson.getEmail());
            updatePerson.setStatus(updatedPerson.getStatus());


            User user = updatePerson.getUser();
            user.setUsername(updatedUsername);
            if (!updatedPerson.getUser().getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updatedPerson.getUser().getPassword()));
                if (roleRepository.existsRoleUser(roleId, user.getId_user()) == 0) {
                    if (roleRepository.saveUserRole(roleId, user.getId_user()) <= 0)
                        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RoleNotAttached"),
                                HttpStatus.BAD_REQUEST);
                }

                return new ResponseEntity<>(new ApiResponse(personRepository.saveAndFlush(updatePerson), HttpStatus.OK), HttpStatus.OK);
            } else {

                if (roleRepository.existsRoleUser(roleId, user.getId_user()) == 0) {
                    if (roleRepository.saveUserRole(roleId, user.getId_user()) <= 0)
                        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RoleNotAttached"),
                                HttpStatus.BAD_REQUEST);
                }

                return new ResponseEntity<>(new ApiResponse(personRepository.saveAndFlush(updatePerson), HttpStatus.OK), HttpStatus.OK);
            }


        }
        return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "RecordNotFound"), HttpStatus.NOT_FOUND);
    }


}




