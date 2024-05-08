package mx.edu.utez.BackendSIGEA.security.service;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.models.User;
import mx.edu.utez.BackendSIGEA.security.entity.UserDetailsImpl;
import mx.edu.utez.BackendSIGEA.services.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserService service;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> foundUser = service.findUserByUsername(username);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            if (!user.getStatus() || !user.getBlocked()) {
                throw new UsernameNotFoundException("userInactiveOrBlocked");
            }
            return UserDetailsImpl.build(foundUser.get());
        }
        throw new UsernameNotFoundException("UserNotFound");
    }
}
