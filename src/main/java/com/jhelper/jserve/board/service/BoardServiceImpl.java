package com.jhelper.jserve.board.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import com.jhelper.jserve.board.BoardSearchDto;
import com.jhelper.jserve.board.BoardService;
import com.jhelper.jserve.board.entity.Board;
import com.jhelper.jserve.board.repository.BoardRepository;
import com.jhelper.jserve.common.PageDto;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class BoardServiceImpl implements BoardService {

    BoardRepository boardRepository;

    public BoardServiceImpl(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    @Override
    public PageDto<Board> findAll(BoardSearchDto boardSearchDto, int page, int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("registerDate").descending());

        Specification<Board> spec = (Root<Board> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction(); // 기본 'AND' 조건

            if (boardSearchDto.getFrom() != null) {
                Predicate fromPredicate = criteriaBuilder.greaterThanOrEqualTo(root.<LocalDateTime>get("registerDate"),
                        boardSearchDto.getFrom());
                predicate = criteriaBuilder.and(predicate, fromPredicate);
            }

            if (boardSearchDto.getTo() != null) {
                Predicate toPredicate = criteriaBuilder.lessThanOrEqualTo(root.<LocalDateTime>get("registerDate"),
                        boardSearchDto.getTo());
                predicate = criteriaBuilder.and(predicate, toPredicate);
            }

            if (boardSearchDto.getRegisterId() != null && !boardSearchDto.getRegisterId().isEmpty()) {
                Predicate registerIdPredicate = criteriaBuilder.equal(root.get("registerId"),
                        boardSearchDto.getRegisterId());
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.or(predicate, registerIdPredicate));
            }

            if (boardSearchDto.getCategory() != null && !boardSearchDto.getCategory().isEmpty()) {
                Predicate categoryPredicate = criteriaBuilder.equal(root.get("category"), boardSearchDto.getCategory());
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.or(predicate, categoryPredicate));
            }

            if (boardSearchDto.getFilter() != null && !boardSearchDto.getFilter().isEmpty()) {
                Predicate titlePredicate = criteriaBuilder.like(root.get("title"),
                        "%" + boardSearchDto.getFilter() + "%");
                Predicate contentPredicate = criteriaBuilder.like(root.get("content"),
                        "%" + boardSearchDto.getFilter() + "%");
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.or(titlePredicate, contentPredicate));
            }

            return predicate;
        };

        Page<Board> pageEntity = boardRepository.findAll(spec, pageRequest);

        return PageDto.<Board>builder().totalElements(pageEntity.getTotalElements()).size(pageEntity.getSize())
                .page(pageEntity.getNumber()).numberOfElements(pageEntity.getNumberOfElements())
                .items(pageEntity.getContent()).build();
    }

    @Override
    public Board findById(Integer id) {
        return boardRepository.findById(id).orElse(null);
    }

    @Override
    public Board create(Board board) {
        board.setRegisterDate(LocalDateTime.now());
        return boardRepository.save(board);
    }

    @Override
    public Board update(Board board) {
        Board oldBoard = findById(board.getId());

        if (oldBoard == null) {
            return null;
        }

        oldBoard.setCategory(board.getCategory());
        oldBoard.setTitle(board.getTitle());
        oldBoard.setContent(board.getContent());
        return boardRepository.save(oldBoard);
    }

    @Override
    public void delete(Integer id) {
        boardRepository.deleteById(id);
    }

}
