package mx.edu.utez.BackendSIGEA.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "degrees")
@NoArgsConstructor
@Setter
@Getter
public class Degree {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_degree;

    @Column(nullable = false)
    private int degree;

    @OneToMany(mappedBy = "degree", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"degree"})
    private Set<Group> groups;


    public Degree(Long id_degree, int degree) {
        this.id_degree = id_degree;
        this.degree = degree;
    }

}
