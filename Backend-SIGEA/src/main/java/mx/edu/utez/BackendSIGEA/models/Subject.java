package mx.edu.utez.BackendSIGEA.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "subjects")
@NoArgsConstructor
@Setter
@Getter
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_subject;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(columnDefinition = "BOOL DEFAULT true")
    private boolean status;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"subject"})
    private Set<Unit> units;

    @ManyToOne
    @JoinColumn(name = "group_id")
    @JsonIgnoreProperties({"subjects"})
    private Group group;

    @ManyToMany
    @JoinTable(
            name = "user_subjects",
            joinColumns = @JoinColumn(name = "subject_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private Set<User> users;

    public Subject(String name, Group group) {
        this.name = name;
        this.group = group;
        this.status = true;
    }

    public Subject(Long id_subject, String name, Group group) {
        this.name = name;
        this.group = group;
        this.status = true;
    }
}
