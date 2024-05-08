package mx.edu.utez.BackendSIGEA.services;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.Subject;
import mx.edu.utez.BackendSIGEA.models.Unit;
import mx.edu.utez.BackendSIGEA.repository.SubjectRepository;
import mx.edu.utez.BackendSIGEA.repository.UnitRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;


@Service
@Transactional
@RequiredArgsConstructor
public class UnitService {

    private final UnitRepository unitRepository;
    private final SubjectRepository subjectRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findAllBySubject(Long subjectId) {
        return new ResponseEntity<>(new ApiResponse(unitRepository.findAllBySubjectId(subjectId), HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> saveUnit(Unit unit, Long subjectId) {
        Optional<Subject> foundSubject = subjectRepository.findById(subjectId);
        if (foundSubject.isPresent()) {
            unit.setSubject(foundSubject.get());
            return new ResponseEntity<>(new ApiResponse(unitRepository.saveAndFlush(unit), HttpStatus.OK), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Subject not found"), HttpStatus.NOT_FOUND);
        }
    }

}
