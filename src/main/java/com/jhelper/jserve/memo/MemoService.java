package com.jhelper.jserve.memo;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.common.PageDto;
import com.jhelper.jserve.memo.entity.Memo;

@Service
public class MemoService {

    @Autowired
    MemoRepository memoRepository;

    public PageDto<Memo> findAll(String username, int page, int size, String filter) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("registerDate").descending());
        Page<Memo> pageEntity = null;

        if (filter.length() > 0) {
            pageEntity = memoRepository.findAllByRegisterIdAndContentContains(username, pageRequest, filter);
        } else {
            pageEntity = memoRepository.findAllByRegisterId(username, pageRequest);
        }

        return PageDto.<Memo>builder().totalElements(pageEntity.getTotalElements()).size(pageEntity.getSize())
                .page(pageEntity.getNumber()).numberOfElements(pageEntity.getNumberOfElements())
                .items(pageEntity.getContent()).build();
    }

    public Memo findById(Integer id) {
        return memoRepository.findById(id).orElse(null);
    }

    public Memo create(Memo memo) {
        memo.setRegisterDate(LocalDateTime.now());
        return memoRepository.save(memo);
    }

    public Memo update(Memo memo) {

        Memo oldMemo = findById(memo.getId());

        if (oldMemo == null) {
            return null;
        }

        oldMemo.setContent(memo.getContent());
        return memoRepository.save(oldMemo);
    }

    public void delete(Integer id) {
        memoRepository.deleteById(id);
    }

}
