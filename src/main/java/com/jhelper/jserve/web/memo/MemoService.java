package com.jhelper.jserve.web.memo;

import java.util.Date;
import java.util.List;

import com.jhelper.jserve.web.entity.Memo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemoService {

    @Autowired
    MemoRepository memoRepository;

    public List<Memo> findAll() {
        return memoRepository.findAll();
    }

    public Memo findById(Integer id) {
        return memoRepository.findById(id).orElse(null);
    }

    public Memo create(Memo memo) {
        memo.setRegisterDate(new Date());
        return memoRepository.save(memo);
    }

    public Memo update(Memo memo) {
        return memoRepository.save(memo);
    }

    public void delete(Integer id) {
        memoRepository.deleteById(id);
    }

}
