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
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final ExamRepository examRepository;
    private final TypeQuestionRepository typeQuestionRepository;
    private final OptionRepository optionRepository;


    //Guardar las questions
    // 1.- Ocupo el id del examen exam_id
    // 2.- tipo de question type_question_id
    // 3.- Score que sera cuanto vale cada pregunta esto puede ser facil por que hace que cada pregunta sea tipo independiente
    // pero aun asi se guarda en un conjunto de mas con el examen
    //4.-Question es en general la pregunta ejemplo   Cuantas llantas tiene un carro ?
    //@@identity  SQL


    // En front duplicar los input y con los forms mandar a aguardar asi guardar cada una las preguntas una por una
    // por si se le cierra lograra guardar las que llevaba
    //Debemos de dejar el atributo de cuantity para asi cuando le cierre o pase algo mandar a llamar el cuantity para pintar los input
    // EL examen se termina de crear cuando se termine las 10 preguntas o las que sean
    // preguntar si se puedo modificar

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        return new ResponseEntity<>(new ApiResponse(questionRepository.findById(id), HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findOptionsByQuestionId(Long id) {
        return new ResponseEntity<>(new ApiResponse(optionRepository.buscar(id), HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> updateQuestion(Question question, Long idQuestion, Long examId, Long typeQuestionId) {
        try {
            Optional<Exam> foundExam = examRepository.findById(examId);
            Optional<TypeQuestion> foundTypeQuestion = typeQuestionRepository.findById(typeQuestionId);
            if (foundExam.isPresent() && foundTypeQuestion.isPresent()) {
                Optional<Question> foundQuestion = questionRepository.findById(idQuestion);
                if (foundQuestion.isPresent()) {
                    // Actualiza los campos de la pregunta encontrada con los valores de la pregunta proporcionada
                    foundQuestion.get().setQuestion(question.getQuestion());
                    foundQuestion.get().setExam(foundExam.get());
                    foundQuestion.get().setTypeQuestion(foundTypeQuestion.get());
                    return new ResponseEntity<>(new ApiResponse
                            (questionRepository.save(foundQuestion.get()), HttpStatus.OK), HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(new ApiResponse
                            (HttpStatus.NOT_FOUND, true, "Exam or TypeQuestion Not Found"), HttpStatus.NOT_FOUND);
                }
            } else {
                return new ResponseEntity<>(new ApiResponse
                        (HttpStatus.NOT_FOUND, true, "Exam or TypeQuestion Not Found"), HttpStatus.NOT_FOUND);

            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(HttpStatus.BAD_REQUEST, true, e.getMessage()));

        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> setScoreQuestion(Long questionId, float score) {
        try {
            Optional<Question> question = questionRepository.findById(questionId);
            if (question.isPresent()) {
                question.get().setScore(score);
                return new ResponseEntity<>(new ApiResponse(questionRepository.save(question.get()), HttpStatus.OK), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Question Not Found"), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> updateOption(Long optionId, String opcion){

        System.out.println("**************************************");
        System.out.println(optionId);
        System.out.println(opcion);
        System.out.println("**************************************");
        try {
            Optional<Option> foundOption = optionRepository.findById(optionId);
            if (foundOption.isPresent()) {
                Option option = foundOption.get();
                option.setOption(opcion);
                return new ResponseEntity<>(new ApiResponse(optionRepository.save(option), HttpStatus.OK), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Option Not Found"), HttpStatus.NOT_FOUND);
            }
        }catch (Exception e){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }






}
