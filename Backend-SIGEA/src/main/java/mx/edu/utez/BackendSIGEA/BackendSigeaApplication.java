package mx.edu.utez.BackendSIGEA;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class BackendSigeaApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendSigeaApplication.class, args);
	}

}
