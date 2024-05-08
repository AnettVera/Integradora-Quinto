package mx.edu.utez.BackendSIGEA.controllers.User;


import jakarta.validation.Valid;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.User;
import mx.edu.utez.BackendSIGEA.models.dto.UserDto;
import mx.edu.utez.BackendSIGEA.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"*"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findById(@PathVariable Long id){
        return userService.findById(id);
    }

    @GetMapping("/allStudents")
    public ResponseEntity<ApiResponse> getAllStudents(){
        return userService.getAllStudents();
    }

    @GetMapping("/allTeachers")
    public ResponseEntity<ApiResponse> getAllTeachers(){
        return userService.getAllTeachers();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> changeStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> statusMap){
        boolean status = statusMap.get("status");
        return userService.changeStatus(id, status);
    }

    //lista de usuarios que respondieron un examen
    @GetMapping("/answers/exam/{examId}")
    public ResponseEntity<ApiResponse> getUsersWithAnswersInExam(@PathVariable Long examId) {
        return userService.getUsersWithAnswersInExam(examId);
    }

}
