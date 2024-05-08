package mx.edu.utez.BackendSIGEA.controllers.auth.dto;

import lombok.Value;
import mx.edu.utez.BackendSIGEA.models.Role;
import mx.edu.utez.BackendSIGEA.models.User;

import java.util.List;

@Value
public class SignedDto {
    String token;
    String tokenType;
    User user;
    List<Role> roles;
}
