package com.jhelper.jserve.board;

import com.jhelper.jserve.board.entity.Board;
import com.jhelper.jserve.common.PageDto;

public interface BoardService {

    public PageDto<Board> findAll(int page, int size);

    public PageDto<Board> findAll(BoardSearchDto boardSearchDto, int page, int size);

    public Board findById(Integer id);

    public Board create(Board board);

    public Board update(Board board);

    public void delete(Integer id);
}
