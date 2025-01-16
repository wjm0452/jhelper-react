package com.jhelper.jserve.web.board;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jhelper.jserve.web.entity.Board;

@Repository
public interface BoardRepository extends JpaRepository<Board, Integer> {
}
