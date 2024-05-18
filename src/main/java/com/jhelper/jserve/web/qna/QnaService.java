package com.jhelper.jserve.web.qna;

import java.util.Date;

import com.jhelper.jserve.web.entity.PageDto;
import com.jhelper.jserve.web.entity.Qna;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class QnaService {

    @Autowired
    QnaRepository qnaRepository;

    public PageDto<Qna> findAll(int page, int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("registerDate").descending());
        Page<Qna> pageEntity = qnaRepository.findAll(pageRequest);

        return PageDto.<Qna>builder()
                .totalPages(pageEntity.getTotalPages())
                .totalElements(pageEntity.getTotalElements())
                .size(pageEntity.getSize())
                .number(pageEntity.getNumber())
                .numberOfElements(pageEntity.getNumberOfElements())
                .items(pageEntity.getContent())
                .build();
    }

    public Qna findById(Integer id) {
        return qnaRepository.findById(id).orElse(null);
    }

    public Qna create(Qna qna) {
        qna.setRegisterDate(new Date());
        return qnaRepository.save(qna);
    }

    public Qna update(Qna qna) {
        Qna oldQna = findById(qna.getId());

        if (oldQna == null) {
            return null;
        }

        oldQna.setTitle(qna.getTitle());
        oldQna.setContent(qna.getContent());
        return qnaRepository.save(oldQna);
    }

    public void delete(Integer id) {
        qnaRepository.deleteById(id);
    }

}
