package mx.edu.utez.BackendSIGEA.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "options")
@NoArgsConstructor
@Setter
@Getter
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_option;

    @Column(name = "`option`", length = 150)
    private String option;

    @OneToMany (mappedBy = "option", cascade = CascadeType.MERGE)
    @JsonIgnoreProperties({"option"})
    private Set<QuestionOption> questionOptions;

    public Option(Long id_option, String option){
        this.id_option = id_option;
        this.option = option;
    }
}
