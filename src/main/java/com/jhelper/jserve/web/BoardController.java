package com.jhelper.jserve.web;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jhelper.jserve.web.board.BoardService;
import com.jhelper.jserve.web.entity.Board;
import com.jhelper.jserve.web.entity.PageDto;

@RestController
@RequestMapping("/api/board")
public class BoardController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    BoardService boardService;

    @GetMapping
    public PageDto<Board> getBoards(
            @RequestParam(name = "filter", required = false) String filter,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {

        Board board = new Board();
        board.setTitle(filter);
        board.setContent(filter);

        return boardService.findAll(board, page, size);
    }

    @GetMapping("/{id}")
    public Board getBoard(@PathVariable Integer id) {
        return boardService.findById(id);
    }

    @PostMapping
    public Board createBoard(@RequestBody Board boardVO, @AuthenticationPrincipal UserDetails userDetails) {
        boardVO.setRegisterId(userDetails.getUsername());
        boardVO.setRegisterDate(LocalDateTime.now());
        return boardService.create(boardVO);
    }

    @PutMapping
    public Board updateBoard(@RequestBody Board boardVO, @AuthenticationPrincipal UserDetails userDetails) {

        Board savedBoard = boardService.findById(boardVO.getId());

        if (!userDetails.getUsername().equals(savedBoard.getRegisterId())) {
            throw new AccessDeniedException("변경할 수 없습니다.");
        }

        return boardService.update(boardVO);
    }

    @DeleteMapping("/{id}")
    public void deleteBoard(@PathVariable Integer id, @AuthenticationPrincipal UserDetails userDetails) {

        Board savedBoard = boardService.findById(id);

        if (!userDetails.getUsername().equals(savedBoard.getRegisterId())) {
            throw new AccessDeniedException("삭제할 수 없습니다.");
        }

        boardService.delete(id);
    }
}
