package com.jhelper.jserve.web;

import java.util.Date;

import com.jhelper.jserve.web.entity.PageDto;
import com.jhelper.jserve.web.entity.Qna;
import com.jhelper.jserve.web.qna.QnaService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/qna")
public class QnAController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    QnaService qnaService;

    @GetMapping
    public PageDto<Qna> allQna(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {
        return qnaService.findAll(page, size);
    }

    @GetMapping("/{id}")
    public Qna qna(@PathVariable Integer id) {
        return qnaService.findById(id);
    }

    @PostMapping
    public Qna createQna(@RequestBody Qna qnaVO, @AuthenticationPrincipal UserDetails userDetails) {
        qnaVO.setRegisterId(userDetails.getUsername());
        qnaVO.setRegisterDate(new Date());
        return qnaService.create(qnaVO);
    }

    @PutMapping
    public Qna updateQna(@RequestBody Qna qnaVO, @AuthenticationPrincipal UserDetails userDetails) {

        Qna savedQna = qnaService.findById(qnaVO.getId());

        if (!userDetails.getUsername().equals(savedQna.getRegisterId())) {
            throw new AccessDeniedException("변경할 수 없습니다.");
        }

        return qnaService.update(qnaVO);
    }

    @DeleteMapping("/{id}")
    public void deleteQna(@PathVariable Integer id, @AuthenticationPrincipal UserDetails userDetails) {

        Qna savedQna = qnaService.findById(id);

        if (!userDetails.getUsername().equals(savedQna.getRegisterId())) {
            throw new AccessDeniedException("삭제할 수 없습니다.");
        }

        qnaService.delete(id);
    }
}
