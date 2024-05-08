package mx.edu.utez.BackendSIGEA.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "open_answers")
@NoArgsConstructor
@Setter
@Getter
public class OpenAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_open_answer;

    @Column(nullable = false)
    private String answer;

    @Column
    private String feedback;

    @Column(columnDefinition = "BOOL")
    private Boolean correct;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnoreProperties({"openAnswers"})
    private Question question;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"openAnswers"})
    private User user;

}
