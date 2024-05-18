package com.jhelper.jserve.web.memo;

import java.util.Date;

import com.jhelper.jserve.web.entity.Memo;
import com.jhelper.jserve.web.entity.PageDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class MemoService {

    @Autowired
    MemoRepository memoRepository;

    public PageDto<Memo> findAll(String username, int page, int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("registerDate").descending());
        Page<Memo> pageEntity = memoRepository.findAllByRegisterId(username, pageRequest);

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

        Memo oldMemo = findById(memo.getId());

        if (oldMemo == null) {
            return null;
        }

        oldMemo.setTitle(memo.getTitle());
        oldMemo.setContent(memo.getContent());
        return memoRepository.save(oldMemo);
    }

    public void delete(Integer id) {
        memoRepository.deleteById(id);
    }

}
