package mx.edu.utez.BackendSIGEA.repository;

import jakarta.transaction.Transactional;
import mx.edu.utez.BackendSIGEA.models.StudentAverageExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StudentAverageExamRepository  extends JpaRepository<StudentAverageExam, Long> {

    @Query(value = "SELECT COUNT(*) FROM student_average WHERE exam_id = :examId AND user_id = :userId", nativeQuery = true)
    Integer countByExamIdAndUserId(@Param("examId") Long examId, @Param("userId") Long userId);

    @Modifying
    @Query(value = "UPDATE student_average SET average_student = :average WHERE exam_id = :examId AND user_id = :userId", nativeQuery = true)
    void updateStudentAverage(@Param("average") String average, @Param("examId") Long examId, @Param("userId") Long userId);


    @Transactional
    @Modifying
    @Query(value = "INSERT INTO student_average (average_student, exam_id, user_id) VALUES (:average, :examId, :userId)", nativeQuery = true)
    void insertStudentAverage(@Param("average") String average, @Param("examId") Long examId, @Param("userId") Long userId);
}
