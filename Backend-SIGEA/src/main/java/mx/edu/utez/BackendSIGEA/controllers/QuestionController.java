package mx.edu.utez.BackendSIGEA.controllers;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.BackendSIGEA.config.ApiResponse;
import mx.edu.utez.BackendSIGEA.models.dto.MultiAnswerDto;
import mx.edu.utez.BackendSIGEA.models.dto.OptionDto;
import mx.edu.utez.BackendSIGEA.models.dto.QuestionDto;
import mx.edu.utez.BackendSIGEA.services.QuestionOptionService;
import mx.edu.utez.BackendSIGEA.services.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/question")
@RequiredArgsConstructor
@CrossOrigin(origins = {"*"})
public class QuestionController {

    private final QuestionService questionService;
    private final QuestionOptionService questionOptionService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getQuestionById(@PathVariable Long id) {
        return questionService.findById(id);
    }

    @GetMapping("/options/{id}")
    public ResponseEntity<ApiResponse> getOptionsByQuestionId(@PathVariable Long id) {
        return questionService.findOptionsByQuestionId(id);
    }

    @PostMapping("/optionChosenStudent")
    public ResponseEntity<ApiResponse> SaveResponsesStudent(@RequestBody MultiAnswerDto multiAnswerDto){
        return questionOptionService.SaveResponsesStudent(multiAnswerDto.getUser().getId_user(),multiAnswerDto.toEntity(),multiAnswerDto.getQuestionOption().getId_question_option());
    }

    @PostMapping("/saveQuestionOption/{idQuestion}")
    public ResponseEntity<ApiResponse> save(@RequestBody OptionDto optionDto, @PathVariable Long idQuestion) {
        return questionOptionService.saveQuestionOption
                (
                        optionDto.toEntity(),
                        idQuestion
                );
    }

    @PutMapping("/saveQuestion/{idQuest}")
    public ResponseEntity<ApiResponse> save(@RequestBody QuestionDto questionDto, @PathVariable Long idQuest) {
        return questionService.updateQuestion(
                questionDto.toEntity(),
                idQuest,
                questionDto.getExam().getId_exam(),
                questionDto.getTypeQuestion().getId_type_question()
        );
    }

  @PutMapping("/updateQuestion/{idQuestionsAndOption}")
public ResponseEntity<ApiResponse> updateOption(@PathVariable String idQuestionsAndOption) {
    String[] parts = idQuestionsAndOption.split(",");
    Long id = Long.parseLong(parts[0]);
    String option = parts[1];

    return questionService.updateOption(id, option);
}

    @PatchMapping("/setScore/{id}")
    public ResponseEntity<ApiResponse> setScore(@PathVariable Long id, @RequestBody Map<String, Float> scoreMap){
        Float score = scoreMap.get("score");
        return questionService.setScoreQuestion(id, score);
    }

    @PatchMapping("/correctOption/{idOption}")
    public ResponseEntity<ApiResponse> changeStatus(@PathVariable Long idOption) {
        return questionOptionService.setOptionCorrect( idOption );
    }


}
