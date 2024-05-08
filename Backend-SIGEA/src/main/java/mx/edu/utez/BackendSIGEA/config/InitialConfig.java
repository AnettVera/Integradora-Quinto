package mx.edu.utez.BackendSIGEA.config;


import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.models.Person;
import mx.edu.utez.BackendSIGEA.models.Role;
import mx.edu.utez.BackendSIGEA.models.TypeQuestion;
import mx.edu.utez.BackendSIGEA.models.User;
import mx.edu.utez.BackendSIGEA.repository.PersonRepository;
import mx.edu.utez.BackendSIGEA.repository.RoleRepository;
import mx.edu.utez.BackendSIGEA.repository.TypeQuestionRepository;
import mx.edu.utez.BackendSIGEA.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class InitialConfig implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final TypeQuestionRepository typeQuestionRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    @Transactional(rollbackFor = {SQLException.class})
    public void run(String... args) throws Exception {
        Role adminRole = getOrSaveRole(new Role("ADMIN"));
        Role teacherRole = getOrSaveRole(new Role("TEACHER"));
        Role studentRole = getOrSaveRole(new Role("STUDENT"));

        Person admin = getOrSavePerson(new Person("Sebastian", null, "Sota", "García", "sebastian@gmail.com", "SOGS971111HBCRRNA6"));
        User user = getOrSaveUser(new User("admin", passwordEncoder.encode("admin"), admin));

        Person docente = getOrSavePerson(new Person("Carlos", "Benjamin", "Díaz", "Pedroza", "cbdp@gmail.com", "aaaaaaaallllllllll"));
        User user2 = getOrSaveUser(new User("docente", passwordEncoder.encode("docente"), docente));

        Person student = getOrSavePerson(new Person("Luis", "Alberto", "Garcia", null, "luis@gmail.com", "bbbbbbbbbbbbbbbbbb"));
        User user3 = getOrSaveUser(new User("student", passwordEncoder.encode("student"), student));

        Person student2 = getOrSavePerson(new Person("Kevin", "Jared", "Lucena", "Pedroza", "jared@gmail.com", "gggggggggggggggggg"));
        User user4 = getOrSaveUser(new User("student2", passwordEncoder.encode("student2"), student2));


        saveUserRoles(user.getId_user(), adminRole.getId_rol());
        saveUserRoles(user2.getId_user(), teacherRole.getId_rol());
        saveUserRoles(user3.getId_user(), studentRole.getId_rol());
        saveUserRoles(user4.getId_user(), studentRole.getId_rol());

        TypeQuestion typeQuestion = getOrSaveTypeQuestion(new TypeQuestion("OPEN_ANSWER"));
        TypeQuestion typeQuestion2 = getOrSaveTypeQuestion(new TypeQuestion("MULTIPLE_ANSWER"));

    }

    @Transactional
    public Role getOrSaveRole(Role role) {
        Optional<Role> foundRole = roleRepository.findByType(role.getType());
        return foundRole.orElseGet(() -> roleRepository.saveAndFlush(role));
    }

    @Transactional
    public Person getOrSavePerson(Person person) {
        Optional<Person> foundPerson = personRepository.findByCurp(person.getCurp());
        return foundPerson.orElseGet(() -> personRepository.saveAndFlush(person));
    }

    @Transactional
    public User getOrSaveUser(User user) {
        Optional<User> foundUser = userRepository.findByUsername(user.getUsername());
        return foundUser.orElseGet(() -> userRepository.saveAndFlush(user));
    }

    @Transactional
    public void saveUserRoles(Long id, Long roleId) {
        Long userRoleId = userRepository.getIdUserRoles(id, roleId);
        if (userRoleId == null)
            userRepository.saveUserRole(id, roleId);
    }

    @Transactional
    public TypeQuestion getOrSaveTypeQuestion(TypeQuestion typeQuestion) {
        Optional<TypeQuestion> foundTypeQuestion = typeQuestionRepository.findByType(typeQuestion.getType());
        return foundTypeQuestion.orElseGet(() -> typeQuestionRepository.saveAndFlush(typeQuestion));
    }

}
