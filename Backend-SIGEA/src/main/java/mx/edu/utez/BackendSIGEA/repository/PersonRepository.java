package mx.edu.utez.BackendSIGEA.repository;

import mx.edu.utez.BackendSIGEA.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findByCurp(String curp);

    //Un estudiante
    @Query(value = "SELECT p FROM persons p JOIN users u ON p.id_person = u.person_id JOIN user_roles ur ON u.id_user = ur.user_id" +
            " JOIN roles r ON ur.role_id = r.id_rol WHERE r.type = 'STUDENT' AND p.id_person = :id", nativeQuery = true)
    Optional<Person> findStudentById(Long id);

    @Query( value = "SELECT p FROM persons p JOIN users u ON p.id_person = u.person_id JOIN user_roles ur ON u.id_user = ur.user_id " +
            " JOIN roles r ON ur.role_id = r.id_rol WHERE r.type = 'TEACHER'" ,nativeQuery = true)
    List<Person> findAllTeacher();

    @Query( value = "SELECT p FROM persons p JOIN users u ON p.id_person = u.person_id JOIN user_roles ur ON u.id_user = ur.user_id " +
            "JOIN roles r ON ur.role_id = r.id_rol WHERE r.type = 'TEACHER' AND p.id_person = :id", nativeQuery = true)
    Optional<Person> findTeacherById(Long id);


}
