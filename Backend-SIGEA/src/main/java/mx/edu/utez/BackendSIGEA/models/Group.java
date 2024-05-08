package mx.edu.utez.BackendSIGEA.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "`groups`")
@NoArgsConstructor
@Setter
@Getter
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_group;

    @Column(name = "`group`", nullable = false)
    private String group;

    @ManyToOne
    @JoinColumn(name = "degree_id")
    @JsonIgnoreProperties({"groups"})
    private Degree degree;

   @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Subject> subjects;

   public Group (String group){
        this.group = group;
    }
    public Group (Long id_group, String group, Degree degree){
        this.id_group = id_group;
        this.group = group;
    }
}
