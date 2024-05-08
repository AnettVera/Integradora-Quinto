package mx.edu.utez.BackendSIGEA.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.BackendSIGEA.models.User;

import java.util.Set;

@Entity
@Table(name = "multi_answers")
@NoArgsConstructor
@Setter
@Getter
public class MultiAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_multi_answer;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"multiAnswers"})
    private User user;

    @ManyToOne
    @JoinColumn(name = "question_option_id", nullable = false)
    @JsonIgnoreProperties({"multiAnswers"})
    private QuestionOption questionoption;

    public MultiAnswer(Long id_multi_answer, User user, QuestionOption questionoption) {
        this.id_multi_answer = id_multi_answer;
        this.user = user;
        this.questionoption = questionoption;
    }
}
