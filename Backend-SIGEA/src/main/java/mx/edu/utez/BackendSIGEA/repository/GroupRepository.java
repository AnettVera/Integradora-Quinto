package mx.edu.utez.BackendSIGEA.repository;

import mx.edu.utez.BackendSIGEA.models.Degree;
import mx.edu.utez.BackendSIGEA.models.Group;
import mx.edu.utez.BackendSIGEA.models.Option;
import mx.edu.utez.BackendSIGEA.models.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByGroup(String group);
    Optional<Group> findByGroupAndDegree(String group, Degree degree);
}
