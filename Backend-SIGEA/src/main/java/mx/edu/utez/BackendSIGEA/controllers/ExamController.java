package mx.edu.utez.BackendSIGEA.controllers;


import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.Exam;
import mx.edu.utez.BackendSIGEA.models.OpenAnswer;
import mx.edu.utez.BackendSIGEA.models.dto.ExamDto;
import mx.edu.utez.BackendSIGEA.services.ExamService;
import mx.edu.utez.BackendSIGEA.services.OpenAnswerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Map;

@RestController
@RequestMapping("/api/exam")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    private final OpenAnswerService openAnswerService;

    //Save Exam
    @PostMapping("/")
    public ResponseEntity<ApiResponse> save(@RequestBody ExamDto examDto) {
        Exam exam = examDto.toEntity();
        return examService.saveExam(exam, examDto.getUnit().getId_unit(), examDto.getUser().getId_user());
    }

    @GetMapping("oneExam/{id}")
    public ResponseEntity<ApiResponse> getExam(@PathVariable Long id){
        return examService.findById(id);
    }

    @GetMapping("/{code}")
    public ResponseEntity<ApiResponse> foundExamCode(@PathVariable String code){
        return examService.findExamenCode(code);
    }

    @GetMapping("allExams/{id}")
    public ResponseEntity<ApiResponse> getAllExams(@PathVariable Long id){
        return examService.findAllByUnit(id);
    }

    @PatchMapping("/limitDay/{id}")
    public ResponseEntity<ApiResponse> updateExamLimitDate(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String combinedDateTime = request.get("combinedDateTime");
            LocalDateTime limitDateTime = LocalDateTime.parse(combinedDateTime, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

            ResponseEntity<ApiResponse> response = examService.updateExamLimitDate(id, limitDateTime);
            return response;
        } catch (DateTimeParseException ex) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "Formato de fecha incorrecto"), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, "Error al actualizar la fecha límite del examen"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> changeStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> statusMap){
        boolean status = statusMap.get("status");
        return examService.changeStatus(id, status);
    }

    @GetMapping("questionsOptions/{id}")
    public ResponseEntity<ApiResponse> obtenerQuestionsAndOptionsExam(@PathVariable Long id){
        return  examService.getQuestionsAndOptionsByExam(id);
    }

    @GetMapping("questionOptionCode/{code}")
    public ResponseEntity<ApiResponse> getQuestionsAndOptionsByExamCode(@PathVariable String code){
        return examService.getQuestionsAndOptionsByExamCode(code);
    }

    @GetMapping("sendTablaQuestionsOptionsId/{id}")
    public ResponseEntity<ApiResponse> getQuestionOptionId(@PathVariable String id){
        //Tendre que mandar el id de esta forma 2,6 y por eso lo separo
        // 2 = el id de la pregunta
        //6 = el id de la options
        String[] parts = id.split(","); // Divide la cadena en partes usando la coma como delimitador
        Long question_id = Long.valueOf(parts[0]); // Obtendre el id
        Long option_id =  Long.valueOf(parts[1]);

        // Llamar al método del servicio y devolver la respuesta
        return examService.getQuestionOptionId(question_id, option_id);
    }


    @PostMapping("insertMultiAnswer/{ids}")
    public ResponseEntity<ApiResponse> insertMultiAnswer(@PathVariable String ids){
        String[] parts = ids.split(","); // Divide la cadena en partes usando la coma como delimitador
        Long user_id = Long.valueOf(parts[0]); // Obtendre el id
        Long question_option_id =  Long.valueOf(parts[1]);
        return examService.insertMultiAnswer(question_option_id, user_id);

    }

    // para guardar una OpenAnswer
    @PostMapping("/openAnswer")
    public void insertOpenAnswer(@RequestBody OpenAnswer openAnswer) {
        examService.insertOpenAnswerDirec(openAnswer.getQuestion().getId_question(), openAnswer.getUser().getId_user(), openAnswer.getAnswer());
    }


    @GetMapping("foundExamForStudent/{id}")
    public ResponseEntity<ApiResponse> foundExamForStudent(@PathVariable Long id){
        System.out.println(id);
        return  examService.foundExamenResponseStudent(id);
    }

    //Para saber si un alumno ya contesto un examen y con esto debo usar el id del user y el code del examen
    //por que si existen dos examanes de la misma unidad si solo conteste uno el otro ya no me deja contesarlo
    @GetMapping("foundExamForStudentValidationCode/{id}")
    public ResponseEntity<ApiResponse> foundExamForStudentValidationCode(@PathVariable String id){
        String[] parts = id.split(","); // Divide la cadena en partes usando la coma como delimitador
        Long user_id = Long.valueOf(parts[0]); // Obtendre el id
        String code =  parts[1];
        return  examService.foundExamenResponseStudentWithCode(user_id,code);
    }



    @GetMapping("/ExamDetailsResponseStudent/{id}")
    public ResponseEntity<ApiResponse> getExamDetailsForUser(@PathVariable String id) {
        String[] parts = id.split(","); // Divide la cadena en partes usando la coma como delimitador
        Long  exam_id = Long.valueOf(parts[0]); // Obtendre el id
        Long  user_id=  Long.valueOf(parts[1]);
        return examService.getExamDetailsForUser(user_id,exam_id);
    }

 /*
    @PatchMapping("/openAnswers/{id}")
    public ResponseEntity<String> updateOpenAnswerCorrect(@PathVariable Long id, @RequestBody Map<String, Boolean> update) {
        Boolean correct = update.get("correct");
        if (correct == null) {
            return ResponseEntity.badRequest().body("Missing 'correct' field");
        }
        boolean updated = openAnswerService.updateCorrect(id, correct);
        if (updated) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

  */

    //Este endpoint es apr aobtener el id de la OpenAnser y pnerle en true
    // osea para cuando el docente va a calificar una Open
    @PatchMapping("/openAnswer/{idUserAndQuestion}")
    public ResponseEntity<ApiResponse> getOpenAnswerId(@PathVariable String idUserAndQuestion, @RequestParam boolean correct, @RequestParam String feedback) {
        String[] parts = idUserAndQuestion.split(","); // Divide la cadena en partes usando la coma como delimitador
        Long user_id = Long.valueOf(parts[0]); // Obtendre el id
        Long question_id =  Long.valueOf(parts[1]);

        System.out.println("***********************");
        System.out.println(user_id);
        System.out.println(question_id);
        System.out.println(correct);
        System.out.println("***********************");

        return examService.getOpenAnswerIdForUser(user_id, question_id, correct, feedback);
    }


    @PostMapping("/student-average")
    public ResponseEntity<ApiResponse> insertStudentAverage(
            @RequestParam String average,
            @RequestParam Long examId,
            @RequestParam Long userId) {
        return examService.saveOrUpdateStudentAverage(average, examId, userId);
    }


}
