package com.jhelper.jserve.web.board;

import java.util.Date;

import com.jhelper.jserve.web.entity.PageDto;
import com.jhelper.jserve.web.entity.Board;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class BoardService {

    @Autowired
    BoardRepository boardRepository;

    public PageDto<Board> findAll(int page, int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("registerDate").descending());
        Page<Board> pageEntity = boardRepository.findAll(pageRequest);

        return PageDto.<Board>builder()
                .totalPages(pageEntity.getTotalPages())
                .totalElements(pageEntity.getTotalElements())
                .size(pageEntity.getSize())
                .number(pageEntity.getNumber())
                .numberOfElements(pageEntity.getNumberOfElements())
                .items(pageEntity.getContent())
                .build();
    }

    public Board findById(Integer id) {
        return boardRepository.findById(id).orElse(null);
    }

    public Board create(Board board) {
        board.setRegisterDate(new Date());
        return boardRepository.save(board);
    }

    public Board update(Board board) {
        Board oldBoard = findById(board.getId());

        if (oldBoard == null) {
            return null;
        }

        oldBoard.setTitle(board.getTitle());
        oldBoard.setContent(board.getContent());
        return boardRepository.save(oldBoard);
    }

    public void delete(Integer id) {
        boardRepository.deleteById(id);
    }

}
