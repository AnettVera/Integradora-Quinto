package mx.edu.utez.BackendSIGEA.models;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "types_questions")
@NoArgsConstructor
@Setter
@Getter
public class TypeQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_type_question;

    @Column(nullable = false, length = 50)
    private String type;

    //relación uno a muchos con la tabla de Question
    @OneToMany(mappedBy = "typeQuestion", cascade = CascadeType.PERSIST)
    @JsonIgnoreProperties({"typeQuestion"})
    private Set<Question> question;

    public TypeQuestion(Long id, String type) {
        this.type = type;
    }

    public TypeQuestion(String type) {
        this.type = type;
    }
}
