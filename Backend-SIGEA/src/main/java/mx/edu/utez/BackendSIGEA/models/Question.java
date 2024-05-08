package mx.edu.utez.BackendSIGEA.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "questions")
@NoArgsConstructor
@Setter
@Getter
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_question;

    @Column
    private Float score;

    @Column
    private String question;

    //Relación muchos a uno con la tabla de TypeQuestion
    @ManyToOne
    @JoinColumn(name = "type_question_id", nullable = false)
    @JsonIgnoreProperties({"question"})
    private TypeQuestion typeQuestion;

    //Relación muchos a uno con la tabla Exam
    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    @JsonIgnoreProperties({"questions"})
    private Exam exam;

    //Relación uno a muchos con la tabla de OpenAnswer
    @OneToMany(mappedBy = "question", cascade = CascadeType.PERSIST)
    @JsonIgnoreProperties({"question"})
    private Set<OpenAnswer> openAnswers;

    //Relación uno a muchos con la tabla de QuestionOption
    @OneToMany(mappedBy = "question", cascade = CascadeType.PERSIST)
    @JsonIgnoreProperties({"question", "multiAnswers"})
    private Set<QuestionOption> questionOptions;

    public Question (Long id, String question, Float score,Long typeQuestion_id){
        this.question = question;
        this.score = score;
    }




}
