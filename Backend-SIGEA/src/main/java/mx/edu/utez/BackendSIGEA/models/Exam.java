package mx.edu.utez.BackendSIGEA.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.Set;

@Entity
@Table(name = "exams")
@NoArgsConstructor
@Setter
@Getter
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_exam;

    @Column(nullable = false, length = 50)
    private String name;

    @Column
    private Integer quantity;

    @Column
    private String code;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime limitDate;

    @Column(columnDefinition = "BOOL DEFAULT false")
    private boolean status;

    @Column
    private Double average;


    @ManyToOne
    @JoinColumn(name = "unit_id", nullable = false)
    @JsonIgnoreProperties({"exams"})
    private Unit unit;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"exams"})
    private User user;

    //Relación de uno a muchos con question
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"exam"})
    private Set<Question> questions;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"exam"})
    private Set<StudentAverageExam> studentAverages;

    public Exam(Long id, String examName, Integer quantity, String code, LocalDateTime limit_date) {
        this.name = examName;
        this.quantity = quantity;
        this.code = code;
        this.limitDate = limit_date;
        this.status = false;
    }

    public String generateCodeExam() {
        Random random = new Random();
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Incluir todas las letras del abecedario y números
        String code = "";

        for (int i = 0; i < 6; i++) {
            int charIndex = random.nextInt(characters.length()); // El numero aleatorio va a hacer el tamaño de todos los caracteres
            code += characters.charAt(charIndex); // y ese random escoge entre los caracteres
        }
        return code;
    }
}
