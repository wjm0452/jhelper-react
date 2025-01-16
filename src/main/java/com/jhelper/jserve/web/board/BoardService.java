package com.jhelper.jserve.web.board;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.web.entity.Board;
import com.jhelper.jserve.web.entity.PageDto;

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

    public PageDto<Board> findAll(Board board, int page, int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("registerDate").descending());

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnoreCase() // 대소문자 구분 없이 검색
                .withNullHandler(ExampleMatcher.NullHandler.IGNORE)
                .withStringMatcher(ExampleMatcher.StringMatcher.EXACT)
                .withMatcher("title",
                        ExampleMatcher.GenericPropertyMatcher.of(ExampleMatcher.StringMatcher.CONTAINING))
                .withMatcher("content",
                        ExampleMatcher.GenericPropertyMatcher.of(ExampleMatcher.StringMatcher.CONTAINING));

        Example<Board> example = Example.of(board, matcher);
        Page<Board> pageEntity = boardRepository.findAll(example, pageRequest);

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
        board.setRegisterDate(LocalDateTime.now());
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
