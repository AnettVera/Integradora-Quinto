package mx.edu.utez.BackendSIGEA.models;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "student_average")
@NoArgsConstructor
@Setter
@Getter
public class StudentAverageExam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idStudentAverage;

    @Column(nullable = true, length = 5)
    private String averageStudent;
    // Muchas Calificaciones pueden tener un user
    // y un user puede tener muchas calificaciones
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIncludeProperties(value = {"id_user", "username"})
    private User user;


    //Un Exam tiene muchas calificaciones de student_average
    // y un student_average tiene muchod Exams
    @ManyToOne
    @JoinColumn(name = "exam_id")
    @JsonIncludeProperties(value = {"id_exam", "name"})
    private Exam exam;

}
