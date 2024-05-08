package mx.edu.utez.BackendSIGEA.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "persons")
@NoArgsConstructor
@Setter
@Getter
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_person;

    @Column(length = 50, nullable = false)
    private String name ;

    @Column(length = 50)
    private String secondName;

    @Column(length = 50, nullable = false)
    private String lastname;

    @Column(length = 50)
    private String surname;

    @Column(length = 50, nullable = false)
    private String email;

    @Column(length = 18, nullable = false)
    private String curp;

    @Column(columnDefinition = "BOOL DEFAULT true")
    private Boolean status;

    @OneToOne(mappedBy = "person", cascade = CascadeType.PERSIST)
    @JsonIgnoreProperties(value = {"person"})
    private User user;

    public Person(String name, String secondName, String lastname, String surname, String email, String curp) {
        this.name = name;
        this.secondName = secondName ;
        this.lastname = lastname;
        this.surname = surname;
        this.email = email;
        this.curp = curp;
    }

    public Person(Long id, String name, String secondName, String lastname, String surname, String email, String curp, User user) {
        this.name = name;
        this.secondName = secondName ;
        this.lastname = lastname;
        this.surname = surname;
        this.email = email;
        this.curp = curp;
        this.user = user;
    }

}
