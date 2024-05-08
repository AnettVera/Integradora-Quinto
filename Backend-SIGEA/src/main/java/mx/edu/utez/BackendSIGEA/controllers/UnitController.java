package mx.edu.utez.BackendSIGEA.controllers;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.dto.UnitDto;
import mx.edu.utez.BackendSIGEA.services.UnitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/unit")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class UnitController {
    private final UnitService unitService;

    @GetMapping("/{subjectId}")
    public ResponseEntity<ApiResponse> findAllBySubject(@PathVariable Long subjectId){
        return unitService.findAllBySubject(subjectId);
    }

    @PostMapping("/{subjectId}")
    public ResponseEntity<ApiResponse> saveUnit(@RequestBody UnitDto unitDto, @PathVariable Long subjectId){
        return unitService.saveUnit(unitDto.toEntity(), subjectId);
    }

}
