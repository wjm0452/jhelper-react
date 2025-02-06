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

import com.jhelper.jserve.board.BoardDeleteDto;
import com.jhelper.jserve.board.BoardSearchDto;
import com.jhelper.jserve.board.BoardService;
import com.jhelper.jserve.board.entity.Board;
import com.jhelper.jserve.common.PageDto;

@RestController
@RequestMapping("/api/board")
public class BoardController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    BoardService boardService;

    @GetMapping
    public PageDto<Board> getBoards(@RequestParam(name = "category") String category,
            @RequestParam(name = "registerId", required = false) String registerId,
            @RequestParam(name = "from", required = false) LocalDateTime from,
            @RequestParam(name = "to", required = false) LocalDateTime to,
            @RequestParam(name = "filter", required = false) String filter,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {

        BoardSearchDto boardSearchDto = new BoardSearchDto();
        boardSearchDto.setCategory(category);
        boardSearchDto.setRegisterId(registerId);
        boardSearchDto.setFrom(from);
        boardSearchDto.setTo(to);
        boardSearchDto.setFilter(filter);

        return boardService.findAll(boardSearchDto, page, size);
    }

    @GetMapping("/{id}")
    public Board getBoard(@PathVariable int id) {
        return boardService.findById(id);
    }

    @PostMapping
    public Board createBoard(@RequestBody Board board, @AuthenticationPrincipal UserDetails userDetails) {
        board.setRegisterId(userDetails.getUsername());
        board.setRegisterDate(LocalDateTime.now());
        return boardService.create(board);
    }

    @PutMapping
    public Board updateBoard(@RequestBody Board board, @AuthenticationPrincipal UserDetails userDetails) {

        Board savedBoard = boardService.findById(board.getId());

        if (!userDetails.getUsername().equals(savedBoard.getRegisterId())) {
            throw new AccessDeniedException("변경할 수 없습니다.");
        }

        return boardService.update(board);
    }

    @DeleteMapping("/{id}")
    public void deleteBoard(@PathVariable int id, @AuthenticationPrincipal UserDetails userDetails) {

        Board savedBoard = boardService.findById(id);

        if (!userDetails.getUsername().equals(savedBoard.getRegisterId())) {
            throw new AccessDeniedException("삭제할 수 없습니다.");
        }

        boardService.delete(id);
    }

    @DeleteMapping
    public void deleteBoard(@RequestBody BoardDeleteDto boardDeleteDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        boardDeleteDto.getIds().forEach(id -> {
            boardService.delete(id);
        });
    }
}
