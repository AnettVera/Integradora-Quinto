package mx.edu.utez.BackendSIGEA.controllers;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.dto.SubjectDto;
import mx.edu.utez.BackendSIGEA.services.SubjectService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subject")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class SubjectController {
    private final SubjectService subjectService;

    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAll(){
        return subjectService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id){
        return subjectService.findById(id);
    }

    @GetMapping("/{name}")
    public ResponseEntity<ApiResponse> getByName(@PathVariable String name){
        return subjectService.findByName(name);
    }

    @GetMapping("/allSubjects/{userId}")
    public ResponseEntity<ApiResponse> getAllByUserId(@PathVariable Long userId){
        return subjectService.findAllByUserId(userId);
    }

    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse> save(@RequestBody SubjectDto subjectDto, @PathVariable Long userId){
        return subjectService.saveSubject(
                subjectDto.toEntity(),
                subjectDto.getGroup().getDegree().getDegree(),
                subjectDto.getGroup().getGroup(),
                userId
        );
    }

    /*
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id){
        return subjectService.changeStatus(id,  );
    }

     */

}
