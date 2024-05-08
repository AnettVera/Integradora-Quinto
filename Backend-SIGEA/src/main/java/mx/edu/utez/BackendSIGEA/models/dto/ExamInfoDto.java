package mx.edu.utez.BackendSIGEA.models.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@Setter
@Getter
public class ExamInfoDto {

        private String examName;
        private Long idExam;
        private Date limitDate;
        private String average;
        private String unitName;
        private String subjectName;
        private String code;



        // getters and setters
}
