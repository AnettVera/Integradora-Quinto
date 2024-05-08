package mx.edu.utez.BackendSIGEA.repository;

import mx.edu.utez.BackendSIGEA.models.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UnitRepository extends JpaRepository<Unit, Long> {

    //Buscar por nombre
    Optional<Unit> findByName(String name);

    @Modifying
    @Query(value = "INSERT INTO units (subject_id) VALUES (:subjectId)", nativeQuery = true)
    int saveUnit(@Param("subjectId") Long subjectId);

    @Query(value = "SELECT * FROM units WHERE subject_id = :subjectId", nativeQuery = true)
    List<Unit> findAllBySubjectId(@Param("subjectId") Long subjectId);


}
