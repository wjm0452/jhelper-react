package com.jhelper.jserve.web;

import java.util.List;

import com.jhelper.jserve.web.entity.Qna;
import com.jhelper.jserve.web.qna.QnaService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/qna")
public class QnAController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    QnaService qnaService;

    @GetMapping
    public List<Qna> allQna() {
        return qnaService.findAll();
    }

    @GetMapping("/{id}")
    public Qna qna(@PathVariable Integer id) {
        return qnaService.findById(id);
    }

    @PostMapping
    public Qna createQna(@RequestBody Qna qnaVO) {
        return qnaService.create(qnaVO);
    }

    @PutMapping
    public Qna updateQna(@RequestBody Qna qnaVO) {
        return qnaService.update(qnaVO);
    }

    @DeleteMapping("/{id}")
    public void deleteQna(@PathVariable Integer id) {
        qnaService.delete(id);
    }
}
