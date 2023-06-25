package com.jhelper.jserve.web;

import java.util.List;

import com.jhelper.jserve.web.entity.Memo;
import com.jhelper.jserve.web.entity.PageDto;
import com.jhelper.jserve.web.entity.Qna;
import com.jhelper.jserve.web.memo.MemoService;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/memo")
public class MemoController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    MemoService memoService;

    @GetMapping
    public PageDto<Memo> allMemo(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {
        return memoService.findAll(page, size);
    }

    @GetMapping("/{id}")
    public Memo qna(@PathVariable Integer id) {
        return memoService.findById(id);
    }

    @PostMapping
    public Memo createQna(@RequestBody Memo memoVO) {
        return memoService.create(memoVO);
    }

    @PutMapping
    public Memo updateQna(@RequestBody Memo memoVO) {
        return memoService.update(memoVO);
    }

    @DeleteMapping("/{id}")
    public void deleteQna(@PathVariable Integer id) {
        memoService.delete(id);
    }
}
