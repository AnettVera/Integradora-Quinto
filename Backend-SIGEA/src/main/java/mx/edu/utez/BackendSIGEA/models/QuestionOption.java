package mx.edu.utez.BackendSIGEA.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "question_options")
@NoArgsConstructor
@Setter
@Getter
public class QuestionOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_question_option;

    @Column(columnDefinition = "BOOL DEFAULT false")
    private boolean correct;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnoreProperties({"questionOptions"})
    private Question question;

    @ManyToOne
    @JoinColumn(name = "option_id", nullable = false)
    @JsonIgnoreProperties({"questionOptions"})
    private Option option;

    @OneToMany(mappedBy = "questionoption", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"questionoption"})
    private Set<MultiAnswer> multiAnswers;
    public QuestionOption (Long id, boolean correct, Question question){
        this.correct = correct;
    }



}
