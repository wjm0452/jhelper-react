package com.jhelper.jserve.web.qna;

import com.jhelper.jserve.web.entity.Qna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QnaRepository extends JpaRepository<Qna, Integer> {

}
