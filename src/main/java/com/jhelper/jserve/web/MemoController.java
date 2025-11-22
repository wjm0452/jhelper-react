package com.jhelper.jserve.web;

import java.time.LocalDateTime;

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

import com.jhelper.jserve.common.PageDto;
import com.jhelper.jserve.memo.MemoService;
import com.jhelper.jserve.memo.entity.Memo;

@RestController
@RequestMapping("/api/memo")
public class MemoController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    MemoService memoService;

    @GetMapping
    public PageDto<Memo> allMemo(@RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "filter", defaultValue = "") String filter,
            @AuthenticationPrincipal UserDetails userDetails) {
        return memoService.findAll(userDetails.getUsername(), page, size, filter);
    }

    @GetMapping("/{id}")
    public Memo qna(@PathVariable Integer id, @AuthenticationPrincipal UserDetails userDetails) {

        Memo savedMemo = memoService.findById(id);

        if (!userDetails.getUsername().equals(savedMemo.getRegisterId())) {
            throw new AccessDeniedException("접근할 수 없습니다.");
        }

        return savedMemo;
    }

    @PostMapping
    public Memo createQna(@RequestBody Memo memoVO, @AuthenticationPrincipal UserDetails userDetails) {
        memoVO.setRegisterId(userDetails.getUsername());
        memoVO.setRegisterDate(LocalDateTime.now());
        return memoService.create(memoVO);
    }

    @PutMapping
    public Memo updateQna(@RequestBody Memo memoVO, @AuthenticationPrincipal UserDetails userDetails) {

        Memo savedMemo = memoService.findById(memoVO.getId());

        if (!userDetails.getUsername().equals(savedMemo.getRegisterId())) {
            throw new AccessDeniedException("변경할 수 없습니다.");
        }

        return memoService.update(memoVO);
    }

    @DeleteMapping("/{id}")
    public void deleteQna(@PathVariable Integer id, @AuthenticationPrincipal UserDetails userDetails) {

        Memo savedMemo = memoService.findById(id);

        if (!userDetails.getUsername().equals(savedMemo.getRegisterId())) {
            throw new AccessDeniedException("삭제 수 없습니다.");
        }

        memoService.delete(id);
    }
}
