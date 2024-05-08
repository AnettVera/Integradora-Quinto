package mx.edu.utez.BackendSIGEA.repository;

import mx.edu.utez.BackendSIGEA.models.Exam;
import mx.edu.utez.BackendSIGEA.models.Unit;
import mx.edu.utez.BackendSIGEA.models.dto.ExamDetailsDto;
import mx.edu.utez.BackendSIGEA.models.dto.ExamInfoDto;
import mx.edu.utez.BackendSIGEA.models.dto.ExamResultStudentDto;
import mx.edu.utez.BackendSIGEA.models.dto.Results;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    List<Exam> findAllByStatus(boolean status);
    Optional<Exam> findByName(String exam);
    Optional<Exam> findByCode(String code);

    @Query(value = "SELECT * FROM exams WHERE unit_id = :unitId", nativeQuery = true)
    List<Exam> findAllByUnit (@Param("unitId") Long unitId);

    @Query(value = "SELECT " +
            "e.id_exam, " +
            "e.name AS exam_name, " +
            "q.id_question, " +
            "q.question, " +
            "tq.type AS question_type, " + // Se agrega el tipo de pregunta aquí
            "(SELECT GROUP_CONCAT(CONCAT(qo.id_question_option, ': ', o.option) SEPARATOR ', ') " +
            " FROM question_options qo " +
            " JOIN options o ON qo.option_id = o.id_option " +
            " WHERE qo.question_id = q.id_question) AS options " +
            "FROM exams e " +
            "JOIN questions q ON q.exam_id = e.id_exam " +
            "JOIN types_questions tq ON q.type_question_id = tq.id_type_question " + // Se realiza el JOIN con la tabla types_questions
            "WHERE e.id_exam = :examId", nativeQuery = true)
    List<Object[]> findExamDetailsByExamId(@Param("examId") Long examId);


    @Query(value = "SELECT id_question_option FROM question_options WHERE option_id = :optionId AND question_id = :questionId", nativeQuery = true)
    Long findQuestionOptionIdByOptionIdAndQuestionId(@Param("optionId") Long optionId, @Param("questionId") Long questionId);

    @Modifying
    @Query(value = "INSERT INTO multi_answers (question_option_id, user_id) VALUES (:id_question_option, :user_id)", nativeQuery = true)
    void insertMultiAnswer(@Param("id_question_option") Long id_question_option, @Param("user_id") Long user_id);


    @Modifying
    @Query(value = "INSERT INTO open_answers (question_id, user_id, answer) VALUES (:question_id, :user_id, :answer)", nativeQuery = true)
    void insertOpenAnswer(@Param("question_id") Long question_id, @Param("user_id") Long user_id, @Param("answer") String answer);


    //Query para obtener los datos del examen si es que un alumno ya contesto un examen
    @Query(value = "SELECT e.name AS examName, " +
            "e.id_exam AS idExam, " +
            "e.limit_date AS limitDate, " +
            "(SELECT AVG(sa.average_student) FROM student_average sa WHERE sa.exam_id = e.id_exam AND sa.user_id = :userId) AS average, " +
            "u.name AS unitName, " +
            "s.name AS subjectName, " +
            "e.code AS code " +
            "FROM exams e " +
            "JOIN units u ON e.unit_id = u.id_unit " +
            "JOIN subjects s ON u.subject_id = s.id_subject " +
            "WHERE EXISTS (SELECT 1 FROM open_answers oa WHERE oa.question_id IN (SELECT id_question FROM questions WHERE exam_id = e.id_exam) AND oa.user_id = :userId) " +
            "OR EXISTS (SELECT 1 FROM multi_answers ma WHERE ma.question_option_id IN (SELECT option_id FROM question_options WHERE question_id IN (SELECT id_question FROM questions WHERE exam_id = e.id_exam)) AND ma.user_id = :userId)", nativeQuery = true)
    List<Object[]> findExamsWithUserResponses(@Param("userId") Long userId);


    @Query(value = "SELECT " +
            "e.name, " + // exam_name
            "e.id_exam, " +
            "e.limit_date, " +
            "e.average, " +
            "e.code, " + // Added exam code
            "u.name, " + // unit_name
            "s.name " + // subject_name
            "FROM exams e " +
            "JOIN units u ON e.unit_id = u.id_unit " +
            "JOIN subjects s ON u.subject_id = s.id_subject " +
            "WHERE e.id_exam IN (" +
            "SELECT DISTINCT q.exam_id " +
            "FROM questions q " +
            "JOIN multi_answers ma ON ma.question_option_id IN (" +
            "SELECT qo.id_question_option " +
            "FROM question_options qo " +
            "WHERE qo.question_id = q.id_question) " +
            "WHERE ma.user_id = :userId " +
            "UNION " +
            "SELECT DISTINCT q.exam_id " +
            "FROM questions q " +
            "JOIN open_answers oa ON oa.question_id = q.id_question " +
            "WHERE oa.user_id = :userId) " +
            "AND e.code = :examCode", nativeQuery = true) // Check against the exam code
    List<Object[]> findExamsWithUserResponsesAndCode(@Param("userId") Long userId, @Param("examCode") String examCode);



    @Query(value =
            "SELECT " +
                    "e.name AS exam, " +
                    "e.id_exam AS examId, " +
                    "q.question AS pregunta, " +
                    "q.id_question AS preguntaId, " +
                    "GROUP_CONCAT(DISTINCT o.option ORDER BY o.option SEPARATOR ', ') AS textoOpciones, " +
                    "COALESCE(oa.answer, GROUP_CONCAT(DISTINCT CASE WHEN ma.question_option_id IS NOT NULL THEN o.option END ORDER BY o.option SEPARATOR ', ')) AS respuestaEstudiante, " +
                    "oa.feedback AS retroalimentacion, " +
                    "CASE " +
                    "    WHEN MAX(oa.correct = b'1') THEN 'Correcta' " +
                    "    WHEN SUM(qo.correct = b'1' AND ma.question_option_id IS NOT NULL) > 0 THEN 'Correcta' " +
                    "    ELSE 'Incorrecta' " +
                    "END AS estadoRespuesta, " +
                    "CASE " +
                    "    WHEN SUM(qo.correct = b'1' AND ma.question_option_id IS NOT NULL) = 0 AND (MAX(oa.correct) IS NULL OR MAX(oa.correct = b'0')) THEN " +
                    "    GROUP_CONCAT(DISTINCT CASE WHEN qo.correct = b'1' THEN o.option END ORDER BY o.option SEPARATOR ', ') " +
                    "    ELSE NULL " +
                    "END AS corrects " +
                    "FROM exams e " +
                    "JOIN questions q ON q.exam_id = e.id_exam " +
                    "LEFT JOIN question_options qo ON qo.question_id = q.id_question " +
                    "LEFT JOIN options o ON o.id_option = qo.option_id " +
                    "LEFT JOIN open_answers oa ON oa.question_id = q.id_question AND oa.user_id = :userId " +
                    "LEFT JOIN multi_answers ma ON ma.question_option_id = qo.id_question_option AND ma.user_id = :userId " +
                    "WHERE e.id_exam = :examId AND (oa.id_open_answer IS NOT NULL OR ma.id_multi_answer IS NOT NULL) " +
                    "GROUP BY q.id_question, oa.answer, oa.feedback " +
                    "ORDER BY e.id_exam, q.id_question",
            nativeQuery = true)
    List<Results> getExamDetails(@Param("userId") Long userId, @Param("examId") Long examId);



    @Query(value = "SELECT id_open_answer FROM open_answers WHERE user_id = :userId AND question_id = :questionId", nativeQuery = true)
    Long findOpenAnswerByUserIdAndQuestionId(@Param("userId") Long userId, @Param("questionId") Long questionId);






    //Cuando el usuario inicie sesion con eso puedo obtener el id y traer el examen el cual tiene como foranea el id del usaurio
    //con eso ya puedo obtener de principio el nombre del exam_name, average(calificacion), Fecha,




}
