package mx.edu.utez.BackendSIGEA.services;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.models.OpenAnswer;
import mx.edu.utez.BackendSIGEA.models.User;
import mx.edu.utez.BackendSIGEA.repository.OpenAnswerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class OpenAnswerService {
    private final OpenAnswerRepository openAnswerRepository;
 /*
    @Transactional(rollbackFor = {SQLException.class})
    public boolean saveOpenAnswer(OpenAnswer openAnswer, Long user_id, Long question_id, Long exam_id) {
        Optional<User> foundUserRoleStudent
    }

  */

    @Transactional
    public boolean updateCorrect(Long openAnswerId, Boolean correct) {
        Optional<OpenAnswer> openAnswer = openAnswerRepository.findById(openAnswerId);
        if (openAnswer.isPresent()) {
            openAnswer.get().setCorrect(correct);
            openAnswerRepository.save(openAnswer.get());
            return true;
        }
        return false;
    }


}
