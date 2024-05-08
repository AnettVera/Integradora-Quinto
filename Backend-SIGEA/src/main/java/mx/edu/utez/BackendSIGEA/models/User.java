package mx.edu.utez.BackendSIGEA.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "users")
@NoArgsConstructor
@Setter
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_user;

    @Column(length = 50)
    private String username;

    @Column(length = 254)
    private String password;

    @Column(columnDefinition =  "BOOL DEFAULT true")
    private Boolean status;

    @Column(columnDefinition = "BOOL DEFAULT true")
    private Boolean blocked;

    private String token;

    @OneToOne
    @JoinColumn(name = "person_id", unique = true)
    @JsonIgnoreProperties(value = {"user"})
    private Person person;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"user"})
    private Set<Exam> exams;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"user"})
    private Set<OpenAnswer> openAnswers;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER )
    @JsonIgnoreProperties({"user"})
    private Set<MultiAnswer> multiAnswers;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"user"})
    private Set<UserNotificationToken> userNotificationTokens;

    @ManyToMany(mappedBy = "users", cascade = CascadeType.MERGE)
    @JsonIgnore
    private Set<Role> roles;

    @ManyToMany(mappedBy = "users", cascade = CascadeType.MERGE)
    @JsonIgnore
    private Set<Subject> subjects;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"user"})
    private Set<StudentAverageExam> studentAverages;



    public User (Long id, String username, String password, Set<Role> roles){
        this.id_user = id;
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.blocked = true;
        this.status = true;
    }

    public User (String username, String password, Person person){
        this.username = username;
        this.password = password;
        this.person = person;
        this.blocked = true;
        this.status = true;
    }


}
