package com.jhelper.jserve.web.memo;

import java.util.Date;
import java.util.List;

import com.jhelper.jserve.web.entity.Memo;
import com.jhelper.jserve.web.entity.PageDto;
import com.jhelper.jserve.web.entity.Qna;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class MemoService {

    @Autowired
    MemoRepository memoRepository;

    public PageDto<Memo> findAll(int page, int size) {
        
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Memo> pageEntity = memoRepository.findAll(pageRequest);

        return PageDto.<Memo>builder()
                .totalPages(pageEntity.getTotalPages())
                .totalElements(pageEntity.getTotalElements())
                .size(pageEntity.getSize())
                .number(pageEntity.getNumber())
                .numberOfElements(pageEntity.getNumberOfElements())
                .items(pageEntity.getContent())
                .build();
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
