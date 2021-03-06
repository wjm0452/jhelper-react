package com.jhelper.jserve.web;

import java.util.List;

import com.jhelper.jserve.web.entity.Memo;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/memo")
public class MemoController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    MemoService memoService;

    @GetMapping
    public List<Memo> allQna() {
        return memoService.findAll();
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
