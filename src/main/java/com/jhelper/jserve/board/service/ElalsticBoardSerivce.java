package com.jhelper.jserve.board.service;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.elasticsearch.core.query.FetchSourceFilter;
import org.springframework.data.elasticsearch.core.query.Query;

import com.jhelper.jserve.board.BoardSearchDto;
import com.jhelper.jserve.board.BoardService;
import com.jhelper.jserve.board.entity.Board;
import com.jhelper.jserve.board.entity.BoardDocument;
import com.jhelper.jserve.board.repository.ElalsticBoardRepository;
import com.jhelper.jserve.common.PageDto;

public class ElalsticBoardSerivce implements BoardService {

    private ElalsticBoardRepository elalsticBoardRepository;
    private ElasticsearchOperations elasticsearchOperations;
    private BoardService boardService;

    public ElalsticBoardSerivce(ElalsticBoardRepository elalsticBoardRepository,
            ElasticsearchOperations elasticsearchOperations, BoardService boardService) {
        this.elasticsearchOperations = elasticsearchOperations;
        this.elalsticBoardRepository = elalsticBoardRepository;
        this.boardService = boardService;
    }

    @Override
    public PageDto<Board> findAll(BoardSearchDto boardSearchDto, int page, int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("registerDate").descending());

        Criteria criteria = new Criteria();

        if (boardSearchDto.getFrom() != null) {
            criteria = criteria.and("registerDate").greaterThanEqual(boardSearchDto.getFrom());
        }

        if (boardSearchDto.getTo() != null) {
            criteria = criteria.and("registerDate").lessThanEqual(boardSearchDto.getTo());
        }

        if (StringUtils.isNotEmpty(boardSearchDto.getRegisterId())) {
            criteria = criteria.and("registerId").is(boardSearchDto.getRegisterId());
        }

        if (StringUtils.isNotEmpty(boardSearchDto.getCategory())) {
            criteria = criteria.and("category").is(boardSearchDto.getCategory());
        }

        if (StringUtils.isNotEmpty(boardSearchDto.getFilter())) {
            Criteria filterCriteria = new Criteria("title").is(boardSearchDto.getFilter()).or("content")
                    .is(boardSearchDto.getFilter());

            criteria = criteria.subCriteria(filterCriteria);
        }

        Query query = new CriteriaQuery(criteria, pageRequest);
        query.addSourceFilter(new FetchSourceFilter(null, new String[] { "content" }));

        SearchHits<BoardDocument> results = elasticsearchOperations.search(query, BoardDocument.class);

        List<Board> items = results.getSearchHits().stream().map(hit -> hit.getContent().toBoard()).toList();

        return PageDto.<Board>builder().totalElements(results.getTotalHits()).size(size).page(page)
                .numberOfElements(results.getSearchHits().size()).items(items).build();

    }

    @Override
    public Board findById(String id) {
        return boardService.findById(id);
    }

    @Override
    public Board create(Board board) {
        Board newBoard = boardService.create(board);
        elalsticBoardRepository.save(BoardDocument.of(newBoard));

        return newBoard;
    }

    @Override
    public Board update(Board board) {
        Board updatedBoard = boardService.update(board);
        elalsticBoardRepository.save(BoardDocument.of(updatedBoard));

        return updatedBoard;
    }

    @Override
    public void delete(String id) {
        boardService.delete(id);
        elalsticBoardRepository.deleteById(id);
    }

}
