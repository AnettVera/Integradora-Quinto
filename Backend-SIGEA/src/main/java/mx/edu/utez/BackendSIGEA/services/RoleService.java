package mx.edu.utez.BackendSIGEA.services;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.repository.RoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findAll() {
        return new ResponseEntity<>(
                new ApiResponse(roleRepository.findAll(), HttpStatus.OK),
                HttpStatus.OK
        );
    }
}
