package com.jhelper.jserve.board.service;

import java.util.List;

import org.hibernate.search.engine.search.predicate.dsl.BooleanPredicateClausesStep;
import org.hibernate.search.engine.search.query.SearchResult;
import org.hibernate.search.engine.search.query.SearchResultTotal;
import org.hibernate.search.mapper.orm.session.SearchSession;

import com.jhelper.jserve.board.BoardSearchDto;
import com.jhelper.jserve.board.entity.Board;
import com.jhelper.jserve.board.repository.BoardRepository;
import com.jhelper.jserve.common.PageDto;

public class SearchBoardService extends BoardServiceImpl {

    private SearchSession searchSession;

    public SearchBoardService(BoardRepository boardRepository, SearchSession searchSession) {
        super(boardRepository);
        this.searchSession = searchSession;
    }

    @Override
    public PageDto<Board> findAll(BoardSearchDto boardSearchDto, int page, int size) {

        SearchResult<Board> searchResult = searchSession.search(Board.class).where(f -> {

            BooleanPredicateClausesStep<?> predicate = f.bool();
            boolean hasCondition = false;

            if (boardSearchDto.getFrom() != null) {
                predicate = predicate.must(
                        f.range().field("registerDate").between(boardSearchDto.getFrom(), boardSearchDto.getTo()));
                hasCondition = true;
            }

            if (boardSearchDto.getRegisterId() != null && !boardSearchDto.getRegisterId().isEmpty()) {
                predicate = predicate.must(f.match().field("registerId").matching(boardSearchDto.getRegisterId()));
                hasCondition = true;
            }

            if (boardSearchDto.getCategory() != null && !boardSearchDto.getCategory().isEmpty()) {
                predicate = predicate.must(f.match().field("category").matching(boardSearchDto.getCategory()));
                hasCondition = true;
            }

            if (boardSearchDto.getFilter() != null && !boardSearchDto.getFilter().isEmpty()) {
                predicate = predicate.must(f.match().fields("title", "content").matching(boardSearchDto.getFilter()));
                hasCondition = true;
            }

            if (!hasCondition) {
                return f.matchAll();
            }

            return predicate;
        }).sort(f -> f.field("registerDate").desc()).fetch(page * size, page + 1 * size);

        SearchResultTotal searchResultTotal = searchResult.total();
        List<Board> items = searchResult.hits();

        return PageDto.<Board>builder().totalElements(searchResultTotal.hitCount()).size(size).page(page)
                .numberOfElements(items.size()).items(items).build();
    }
}