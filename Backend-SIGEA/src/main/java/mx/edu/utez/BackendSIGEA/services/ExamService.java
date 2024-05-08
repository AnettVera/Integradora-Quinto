package mx.edu.utez.BackendSIGEA.services;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.*;
import mx.edu.utez.BackendSIGEA.models.dto.ExamDetailsDto;
import mx.edu.utez.BackendSIGEA.models.dto.ExamInfoDto;
import mx.edu.utez.BackendSIGEA.models.dto.ExamResultStudentDto;
import mx.edu.utez.BackendSIGEA.models.dto.Results;
import mx.edu.utez.BackendSIGEA.repository.*;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final UnitRepository unitRepository;
    private final QuestionRepository questionRepository;
    private final TypeQuestionRepository typeQuestionRepository;
    private final OpenAnswerRepository openAnswerRepository;
    private final StudentAverageExamRepository studentAverageExamRepository;


    //Docente y tambien cuando consulte sus examenes nececitamos mostrarselos
    //CREAR EXAM
    //Esto dependera de las pantallas
    //1.- Guardar el examen primero solo el examen con la unidad  y la unidad conlleva la subjects
    //2.- Guardar las preguntas
    //3.- Guardar las respuestas

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        return new ResponseEntity<>(new ApiResponse(examRepository.findById(id), HttpStatus.OK), HttpStatus.OK);
    }

    //Bucar Examen por codigo
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findExamenCode(String code) {
        Optional<Exam> foundExam = examRepository.findByCode(code);
        if (foundExam.isPresent()) {
            Exam setExam = foundExam.get();
            return new ResponseEntity<>(new ApiResponse(setExam, HttpStatus.OK), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RoleNotAttached"),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findAllByUnit(Long unitId) {
        return new ResponseEntity<>(new ApiResponse(examRepository.findAllByUnit(unitId), HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> saveExam(Exam exam, Long unitId, Long userId) {
        String code = "";
        Optional<Unit> foundUnit = unitRepository.findById(unitId);
        if (foundUnit.isPresent()) {
            Optional<User> foundUser = userRepository.findById(userId);
            if (foundUser.isPresent()) {
                code = exam.generateCodeExam();
                Optional<Exam> foundCode = examRepository.findByCode(code);
                while (foundCode.isPresent()) {
                    code = exam.generateCodeExam();
                    foundCode = examRepository.findByCode(code);
                }
                exam.setCode(code);
                exam.setUnit(foundUnit.get());
                exam.setUser(foundUser.get());

                Exam savedExam = examRepository.saveAndFlush(exam);

                Optional<TypeQuestion> typeQuestion = typeQuestionRepository.findById(1L);
                if (typeQuestion.isPresent()) {
                    for (int i = 0; i < exam.getQuantity() * 2 ; i ++) {
                        Question question = new Question();
                        question.setExam(savedExam);
                        question.setTypeQuestion(typeQuestion.get());
                        questionRepository.save(question);
                    }
                }

                return new ResponseEntity<>(new ApiResponse(savedExam, HttpStatus.OK), HttpStatus.OK);
            }
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "UserNotFound"), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "UnitNotFound"), HttpStatus.BAD_REQUEST);
    }
    public ResponseEntity<ApiResponse> updateExamLimitDate(Long id, LocalDateTime newLimitDate) {
        try {
            Optional<Exam> optionalExam = examRepository.findById(id);
            if (optionalExam.isPresent()) {
                Exam exam = optionalExam.get();
                exam.setLimitDate(newLimitDate);
                return new ResponseEntity<>(new ApiResponse(examRepository.save(exam), HttpStatus.OK), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Examen no encontrado"), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, "Error al actualizar la fecha límite del examen"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    public ResponseEntity<ApiResponse> changeStatus(Long id, boolean status) {
        Optional<Exam> foundExam = examRepository.findById(id);
        if (foundExam.isEmpty())
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Exam not found"),
                    HttpStatus.NOT_FOUND);
        foundExam.get().setStatus(status);
        return new ResponseEntity<>(new ApiResponse(examRepository.saveAndFlush(foundExam.get()), HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> getQuestionsAndOptionsByExam(Long id) {
        Optional<Exam> foundExam = examRepository.findById(id);
        if(foundExam.isPresent() ){
            List<Object[]> examDetails = examRepository.findExamDetailsByExamId(id);
            List<ExamDetailsDto> examDetailsDtos = examDetails.stream().map(detail -> {
                ExamDetailsDto dto = new ExamDetailsDto();
                dto.setIdExam((Long) detail[0]);
                dto.setExamName((String) detail[1]);
                dto.setIdQuestion((Long) detail[2]);
                dto.setQuestion((String) detail[3]);
                dto.setQuestionType((String) detail[4]); // Asigna el tipo de pregunta
                dto.setOptions((String) detail[5]); // Actualizado para incluir el tipo de pregunta
                return dto;
            }).collect(Collectors.toList());
            return new ResponseEntity<>(new ApiResponse(examDetailsDtos, HttpStatus.OK), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiResponse("Exam not found", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> getQuestionsAndOptionsByExamCode(String code) {
        Optional<Exam> foundExam = examRepository.findByCode(code);
        if (foundExam.isPresent() && foundExam.get().isStatus() == true) {
            List<Object[]> examDetails = examRepository.findExamDetailsByExamId(foundExam.get().getId_exam());
            List<ExamDetailsDto> examDetailsDtos = new ArrayList<>();
            int count = 0;
            int halfSize = examDetails.size() / 2;

            // Mezcla la lista para aleatorizarla
            Collections.shuffle(examDetails);

            for (Object[] detail : examDetails) {
                if (count == halfSize) {
                    break;
                }
                ExamDetailsDto dto = new ExamDetailsDto();
                dto.setIdExam((Long) detail[0]);
                dto.setExamName((String) detail[1]);
                dto.setIdQuestion((Long) detail[2]);
                dto.setQuestion((String) detail[3]);
                dto.setQuestionType((String) detail[4]); // Asigna el tipo de pregunta
                dto.setOptions((String) detail[5]); // Actualizado para incluir el tipo de pregunta
                examDetailsDtos.add(dto);
                count++;
            }

            return new ResponseEntity<>(new ApiResponse(examDetailsDtos, HttpStatus.OK), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiResponse("Exam not found", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
        }
    }

    //Metodo para obtener el id de la questions_Options
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> getQuestionOptionId(Long questionId, Long optionId){
        try {
            Long questionOptionId = examRepository.findQuestionOptionIdByOptionIdAndQuestionId(optionId, questionId);
            if(questionOptionId != null){
                return new ResponseEntity<>(new ApiResponse(questionOptionId, HttpStatus.OK), HttpStatus.OK);
            }else{
                return new ResponseEntity<>(new ApiResponse("Question Option not found", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, "Database error while fetching Question Option Id"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Metodo para insertar en multi_answers que ya seria la respeusta del user
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> insertMultiAnswer(Long id_question_option, Long user_id){
        try {
            examRepository.insertMultiAnswer(id_question_option, user_id);
            return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false, "Data inserted successfully"), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, "Database error while inserting into multi_answers"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> insertOpenAnswerDirec(Long id_question,Long id_user, String answer){
        try {
            examRepository.insertOpenAnswer(id_question,id_user,answer);
            return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false, "Open answer inserted successfully"), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, "Database error while inserting open answer"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> foundExamenResponseStudent(Long id_user) {
        System.out.println("sasasdasdasdasdasddasd");
        System.out.println(id_user);
        System.out.println("sadadadsadsasdasdasdasd");
        List<Object[]> results = examRepository.findExamsWithUserResponses(id_user);
        List<ExamInfoDto> examInfoDtos = new ArrayList<>();


        for (Object[] result : results) {
            ExamInfoDto dto = new ExamInfoDto();
            dto.setExamName((String) result[0]);
            dto.setIdExam((Long) result[1]);
            dto.setLimitDate((Date) result[2]);
            dto.setAverage(String.valueOf(result[3]));
            dto.setUnitName((String) result[4]);
            dto.setSubjectName((String) result[5]);
            examInfoDtos.add(dto);
        }
        System.out.println();
        if (!examInfoDtos.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(examInfoDtos, HttpStatus.OK), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiResponse("NO exams found for the user", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
        }
    }

    //Metodo para validar si un stundet ya contesto el examen con su id y el code del examen para mas simplicidad
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> foundExamenResponseStudentWithCode(Long userId, String examCode) {
        List<Object[]> results = examRepository.findExamsWithUserResponsesAndCode(userId, examCode);
        System.out.println("*********************");
        System.out.println(results.size());
        System.out.println("*********************");
        if (!results.isEmpty()) {
            System.out.println("*********************");
            System.out.println("si");
            System.out.println("*********************");
            return new ResponseEntity<>(new ApiResponse(1, HttpStatus.OK), HttpStatus.OK);
        } else {
            System.out.println("*********************");
            System.out.println("no");
            System.out.println("*********************");
            return new ResponseEntity<>(new ApiResponse(0, HttpStatus.OK), HttpStatus.OK);

        }
    }


    // Metodo para traer un examen que un user ya contesto con su id y el id del examen
    // para que solo traega las preguntas de ese examen y no todas de todos los examenes
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> getExamDetailsForUser(Long userId, Long id_exam) {

        List<Results> examResultStudentDtos = examRepository.getExamDetails(userId,id_exam);
        System.out.println(userId);
        System.out.println(id_exam);
        System.out.println(examResultStudentDtos.size());

        if (!examResultStudentDtos.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(examResultStudentDtos, HttpStatus.OK), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiResponse("No exam details found for the user", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
        }
    }

    //este metodo es para obtener el id de la OpenAnswer para mandarlo a poner en true
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> getOpenAnswerIdForUser(Long userId, Long questionId, boolean correct, String feedback) {
        try {
            Long openAnswerId = examRepository.findOpenAnswerByUserIdAndQuestionId(userId, questionId);

            System.out.println(openAnswerId);
            if(openAnswerId != null){
                Optional<OpenAnswer> foundOpenAnswer =  openAnswerRepository.findById(openAnswerId);
                if(foundOpenAnswer.isPresent()){
                    OpenAnswer openAnswer = foundOpenAnswer.get();
                    openAnswer.setCorrect(correct);


                    if(!feedback.equals("null")  && !feedback.isEmpty()){

                        openAnswer.setFeedback(feedback);
                    }else{
                        openAnswer.setFeedback(" ");
                    }

                    openAnswerRepository.save(openAnswer); // Save the updated OpenAnswer
                    return new ResponseEntity<>(new ApiResponse(openAnswer, HttpStatus.OK), HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(new ApiResponse("Open answer not found for the given user id and question id", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
                }
            } else {
                return new ResponseEntity<>(new ApiResponse("Open answer not found for the given user id and question id", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, "Database error while fetching Open Answer Id"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Scheduled(cron = "0 * * * * ?")
    public void updateExamStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<Exam> activeExams = examRepository.findAllByStatus(true);
        for (Exam exam : activeExams) {
            System.out.println(exam);
            if (now.isAfter(exam.getLimitDate())) {
                exam.setStatus(false);
                examRepository.save(exam);
            }
        }
    }


    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> saveOrUpdateStudentAverage(String average, Long examId, Long userId) {
        System.out.println("*********************************************************************");
        System.out.println(average);
        System.out.println("*********************************************************************");

        try {
            // Primero, verificar si existe un registro
            Integer count = studentAverageExamRepository.countByExamIdAndUserId(examId, userId);

            if (count > 0) {
                // Si existe, actualizar
                studentAverageExamRepository.updateStudentAverage(average, examId, userId);
            } else {
                // Si no existe, insertar
                studentAverageExamRepository.insertStudentAverage(average, examId, userId);
            }
            return new ResponseEntity<>(new ApiResponse("Average saved successfully", HttpStatus.OK), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, "Database error while saving average"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}
