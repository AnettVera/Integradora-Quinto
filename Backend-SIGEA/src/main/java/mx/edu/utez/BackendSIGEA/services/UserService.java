package mx.edu.utez.BackendSIGEA.services;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.User;
import mx.edu.utez.BackendSIGEA.repository.PersonRepository;
import mx.edu.utez.BackendSIGEA.repository.RoleRepository;
import mx.edu.utez.BackendSIGEA.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    //FIND USER BY USERNAME
    @Transactional(readOnly = true)
    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    //FIND USER BY ID
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if(user.isEmpty())
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "User not found"),
                    HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(new ApiResponse(user, HttpStatus.OK), HttpStatus.OK);
    }

    //GET ALL USERS STUDENTS
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAllStudents() {
        return new ResponseEntity<>(new ApiResponse(userRepository.findAllStudents(), HttpStatus.OK), HttpStatus.OK);
    }

    //GET ALL USERS TEACHERS
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAllTeachers() {
        return new ResponseEntity<>(new ApiResponse(userRepository.findAllTeachers(), HttpStatus.OK), HttpStatus.OK);
    }

    //Update Status User
    public ResponseEntity<ApiResponse> changeStatus(Long id, boolean status) {
        Optional<User> user = userRepository.findById(id);
        if(user.isEmpty())
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "User not found"),
                    HttpStatus.NOT_FOUND);
        user.get().setStatus(status);
        return new ResponseEntity<>(new ApiResponse(userRepository.saveAndFlush(user.get()), HttpStatus.OK), HttpStatus.OK);
    }

    //GET DE TODOS LOS USARIOS QUE RESPONDIERON UN EXAMEN
    public ResponseEntity<ApiResponse> getUsersWithAnswersInExam(Long examId) {
        List<User> users = userRepository.findUsersWithAnswersInExam(examId);
        if (users.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "No users found for the provided exam ID"),
                    HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new ApiResponse(users, HttpStatus.OK), HttpStatus.OK);
    }


}
