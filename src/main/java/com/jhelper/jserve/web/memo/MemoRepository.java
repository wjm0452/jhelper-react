package com.jhelper.jserve.web.memo;

import com.jhelper.jserve.web.entity.Memo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemoRepository extends JpaRepository<Memo, Integer> {
    public Page<Memo> findAllByRegisterId(String username, PageRequest pageRequest);
}
