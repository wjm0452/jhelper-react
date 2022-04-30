package com.jhelper.jserve.web.qna;

import java.util.Date;
import java.util.List;

import com.jhelper.jserve.web.entity.Qna;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QnaService {

    @Autowired
    QnaRepository qnaRepository;

    public List<Qna> findAll() {
        return qnaRepository.findAll();
    }

    public Qna findById(Integer id) {
        return qnaRepository.findById(id).orElse(null);
    }

    public Qna create(Qna qna) {
        qna.setRegisterId("wjm");
        qna.setRegisterDate(new Date());
        return qnaRepository.save(qna);
    }

    public Qna update(Qna qna) {
        return qnaRepository.save(qna);
    }

    public void delete(Integer id) {
        qnaRepository.deleteById(id);
    }

}
