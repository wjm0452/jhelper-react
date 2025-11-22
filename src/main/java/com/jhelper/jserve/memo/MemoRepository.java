package com.jhelper.jserve.memo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jhelper.jserve.memo.entity.Memo;

@Repository
public interface MemoRepository extends JpaRepository<Memo, Integer> {
    public Page<Memo> findAllByRegisterId(String username, PageRequest pageRequest);

    public Page<Memo> findAllByRegisterIdAndContentContains(String username, PageRequest pageRequest, String content);
}
