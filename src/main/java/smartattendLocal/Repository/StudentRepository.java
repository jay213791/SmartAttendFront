package smartattendLocal.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import smartattendLocal.Entity.Student;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    boolean existsByEmailAndCardId(String email, int cardId);
    boolean existsByStudentNumber(String studentNumber);
    List<Student> findByTeacherEmail(String teacherEmail);
    List<Student> findByCardId(int cardId);
    long countByTeacherEmail(String email);
}
