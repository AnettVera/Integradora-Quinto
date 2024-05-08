package mx.edu.utez.BackendSIGEA.services;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.*;
import mx.edu.utez.BackendSIGEA.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class QuestionOptionService {

    private final ExamRepository examRepository;
    private final QuestionOptionRepository questionOptionRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final UserRepository userRepository;
    private final MultiAnswerRepository multiAnswerRepository;

    //Guardar la OPTION CORRECTA
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> setOptionCorrect(Long option_id) {
        try {
            // Guardar el id de la pregunta
            Optional<QuestionOption> foundOption = questionOptionRepository.findById(option_id);
            if (foundOption.isPresent()) {
                QuestionOption questionOption = foundOption.get();
                questionOption.setCorrect(true);
                return new ResponseEntity<>(new ApiResponse(questionOptionRepository.save(questionOption), HttpStatus.OK), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Option Not Found"), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(HttpStatus.BAD_REQUEST, true, e.getMessage()));
        }
    }


    //Aqui debemos de desarrollar la logica para que el estudiante logre responder
    // el examen para eso ocuparemos agregar un campo en multi_answer para saber cual de todas las
    //options escogio el estudiante esto seria el atributo responseAlumno.
    // con react haremos la logica para mostrarle al estudiante las respuestas que tuvo bien y las que no
    // esto lo lograremos obteniendo el id de la option que puso el usuario y la cual guardaremos en responseAlumno
    // y eso lo compararemos con questions_options la correcta opcion y ya

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> SaveResponsesStudent(Long user_id, MultiAnswer multiAnswer, Long question_option_id) {
        // Nececito hacer la logica para guarda la respuesta de la pregunta que el alumno aya escogido

        //Buscar si el usuario existe y setearlo
        Optional<User> foundUser = userRepository.findById(user_id);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            multiAnswer.setUser(user);

            //Buscar si el id de la question options que eligio existe
            Optional<QuestionOption> foundQuestionsOption = questionOptionRepository.findById(question_option_id);
            if (foundQuestionsOption.isPresent()) {
                QuestionOption questionOption = foundQuestionsOption.get();
                multiAnswer.setQuestionoption(questionOption);
                //logica para saber si eligio la respuesta correcta
                MultiAnswer multiAnswer1 = multiAnswerRepository.save(multiAnswer);
                // aqui tengo dudas por que ya se como identificar cual es la respuesta es la correcta pero
                // no se como mandarle eso al front para mostrarlo creo que con el data que llevara todo el objeto de
                // multiAnswers
                if (questionOption.isCorrect()) {
                    // si la respuesta que es escogio es correcta
                    return new ResponseEntity<>(new ApiResponse(multiAnswer1, HttpStatus.OK), HttpStatus.OK);
                } else {
                    // si la respuesta que escogio no es correcta
                    return new ResponseEntity<>(new ApiResponse(multiAnswer1, HttpStatus.OK), HttpStatus.OK);
                }
            } else {
                return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "QuestionsOptionsNotFound"),
                        HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "UserNotFound"),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> saveQuestionOption(Option option, Long questionId) {
        Optional<Question> foundQuestion = questionRepository.findById(questionId);
        if (foundQuestion.isPresent()) {
            option.setOption(option.getOption());
            Option savedOption = optionRepository.save(option);

            QuestionOption questOpt = new QuestionOption();
            questOpt.setQuestion(foundQuestion.get());
            questOpt.setOption(savedOption);
            questionOptionRepository.saveAndFlush(questOpt);

            return new ResponseEntity<>(new ApiResponse(questOpt, HttpStatus.OK), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Question Not Found"), HttpStatus.NOT_FOUND);
        }
    }


}
