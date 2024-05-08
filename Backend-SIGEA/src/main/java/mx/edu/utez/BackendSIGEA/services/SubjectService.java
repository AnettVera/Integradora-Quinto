package mx.edu.utez.BackendSIGEA.services;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.Degree;
import mx.edu.utez.BackendSIGEA.models.Group;
import mx.edu.utez.BackendSIGEA.models.Subject;
import mx.edu.utez.BackendSIGEA.repository.DegreeRepository;
import mx.edu.utez.BackendSIGEA.repository.GroupRepository;
import mx.edu.utez.BackendSIGEA.repository.SubjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class SubjectService {
    private final SubjectRepository subjectRepository;
    private final DegreeRepository degreeRepository;
    private final GroupRepository groupRepository;

    //Get All
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findAll() {
        return new ResponseEntity<>(new ApiResponse(subjectRepository.findAll(), HttpStatus.OK), HttpStatus.OK);
    }

    //Get By ID
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        return new ResponseEntity<>(new ApiResponse(subjectRepository.findById(id), HttpStatus.OK), HttpStatus.OK);
    }

    //Get By Name
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findByName(String name) {
        return new ResponseEntity<>(new ApiResponse(subjectRepository.findByName(name), HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findAllByUserId(Long userId) {
        return new ResponseEntity<>(new ApiResponse(subjectRepository.findAllByUserId(userId), HttpStatus.OK), HttpStatus.OK);
    }

    //Post / SAVE SUBJECT
    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<ApiResponse> saveSubject(Subject subject, int saveDegree, String saveGroup, Long userId) {
        try {
            Degree degree = degreeRepository.findByDegree(saveDegree)
                    .orElseGet(() -> {
                        Degree newDegree = new Degree();
                        newDegree.setDegree(saveDegree);
                        return degreeRepository.save(newDegree);
                    });

            Group group = groupRepository.findByGroupAndDegree(saveGroup, degree)
                    .orElseGet(() -> {
                        Group newGroup = new Group();
                        newGroup.setGroup(saveGroup);
                        newGroup.setDegree(degree);
                        return groupRepository.save(newGroup);
                    });

            Optional<Subject> existingSubject = subjectRepository.findByNameAndGroup(subject.getName(), group);
            if (!existingSubject.isPresent()) {
                subject.setName(subject.getName().toUpperCase());
                subject.setGroup(group);
                Subject savedSubject = subjectRepository.saveAndFlush(subject);

                if (subjectRepository.existsUserSubject(savedSubject.getId_subject(), userId) == 0) {
                    if (subjectRepository.saveUserSubject(savedSubject.getId_subject(), userId) <= 0)
                        return new ResponseEntity<> (new ApiResponse
                                (HttpStatus.BAD_REQUEST, true, "User Not Attached"), HttpStatus.BAD_REQUEST);
                }

                return new ResponseEntity<>(new ApiResponse(savedSubject, HttpStatus.OK), HttpStatus.OK);

            } else {
                // Si la materia ya existe en el grupo, simplemente retornamos un conflicto sin comprobar de nuevo.
                return new ResponseEntity<>(new ApiResponse( HttpStatus.CONFLICT, true, "La materia ya existe en el grupo"), HttpStatus.CONFLICT);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "Error al guardar la materia"), HttpStatus.BAD_REQUEST);
        }
    }


    //Patch change status
    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<ApiResponse> changeStatus(Long id) {
        Optional<Subject> subject = subjectRepository.findById(id);
        if (subject.isPresent()) {
            subject.get().setStatus(!subject.get().isStatus());
            return new ResponseEntity<>(new ApiResponse(subjectRepository.save(subject.get()), HttpStatus.OK), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiResponse("No se encontro la materia", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
        }
    }
}
