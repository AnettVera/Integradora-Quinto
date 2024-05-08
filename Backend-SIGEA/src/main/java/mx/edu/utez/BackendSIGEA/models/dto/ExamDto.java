package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.Exam;
import mx.edu.utez.BackendSIGEA.models.Question;
import mx.edu.utez.BackendSIGEA.models.Unit;
import mx.edu.utez.BackendSIGEA.models.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@NoArgsConstructor
@Setter
@Getter
public class ExamDto {

    private Long id_exam;
    private String name;
    private Integer quantity;
    private String code;
    private LocalDateTime dateLimit;
    private boolean status;
    private float average;

    private Unit unit;
    private User user;
    private Set<Question> questions;


    public Exam toEntity(){
        return new Exam(id_exam, name, quantity, code, dateLimit);
    }




}



