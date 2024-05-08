package mx.edu.utez.BackendSIGEA.repository;


import mx.edu.utez.BackendSIGEA.models.Degree;
import mx.edu.utez.BackendSIGEA.models.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface DegreeRepository extends JpaRepository<Degree, Long>{
    Optional<Degree> findByDegree(int degree);
}
