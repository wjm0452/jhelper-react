package com.jhelper.jserve.board.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.search.engine.search.query.SearchResult;
import org.hibernate.search.mapper.pojo.standalone.mapping.SearchMapping;
import org.hibernate.search.mapper.pojo.standalone.session.SearchSession;
import org.springframework.transaction.annotation.Transactional;

import com.jhelper.jserve.board.BoardSearchDto;
import com.jhelper.jserve.board.BoardService;
import com.jhelper.jserve.board.entity.Board;
import com.jhelper.jserve.board.entity.SearchBoard;
import com.jhelper.jserve.common.PageDto;

public class SearchBoardService implements BoardService {

    private SearchMapping searchMapping;

    public SearchBoardService(SearchMapping searchMapping) {
        this.searchMapping = searchMapping;
    }

    private SearchMapping getSearchMapping() {
        return searchMapping;
    }

    @Transactional
    @Override
    public PageDto<Board> findAll(BoardSearchDto boardSearchDto, int page, int size) {

        SearchResult<Object[]> result = getSearchMapping().createSession().search(SearchBoard.class)
                .select(f -> f.composite()
                        .from(f.id(String.class),
                            f.field("category", String.class),
                            f.field("title", String.class),
                            f.field("content", String.class),
                            f.field("registerId", String.class),
                            f.field("registerDate", LocalDateTime.class))
                        .asArray())
                .where(f -> f.matchAll()).fetch(page * size, (page + 1) * size);

        long total = result.total().hitCount();
        List<Board> hits = result.hits().stream().map(doc -> {
            Board board = new Board();
            board.setId((String) doc[0]);
            board.setCategory((String) doc[1]);
            board.setTitle((String) doc[2]);
            board.setContent((String) doc[3]);
            board.setRegisterId((String) doc[4]);
            board.setRegisterDate((LocalDateTime) doc[5]);
            return board;
        }).toList();

        return PageDto.<Board>builder().totalElements(total).size(size).page(page).numberOfElements(hits.size())
                .items(hits).build();
    }

    @Transactional
    @Override
    public Board findById(String id) {
        Object[] doc = getSearchMapping().createSession().search(SearchBoard.class)
                .select(f -> f.composite()
                        .from(f.id(String.class),
                            f.field("category", String.class),
                            f.field("title", String.class),
                            f.field("content", String.class),
                            f.field("registerId", String.class),
                            f.field("registerDate", LocalDateTime.class))
                        .asArray())
                .where(f -> f.id().matching(id)).fetchSingleHit().orElse(null);

        Board board = new Board();
        board.setId((String) doc[0]);
        board.setCategory((String) doc[1]);
        board.setTitle((String) doc[2]);
        board.setContent((String) doc[3]);
        board.setRegisterId((String) doc[4]);
        board.setRegisterDate((LocalDateTime) doc[5]);

        return board;
    }

    @Transactional
    @Override
    public Board create(Board board) {
        try (SearchSession searchSession = getSearchMapping().createSession()) {
            board.setId(UUID.randomUUID().toString());
            board.setRegisterDate(LocalDateTime.now());

            SearchBoard doc = SearchBoard.of(board);

            searchSession.indexingPlan().addOrUpdate(doc);
        }

        return board;
    }

    @Transactional
    @Override
    public Board update(Board board) {
        try (SearchSession searchSession = getSearchMapping().createSession()) {
            SearchBoard doc = SearchBoard.of(board);
            searchSession.indexingPlan().addOrUpdate(doc);
        }

        return board;
    }

    @Override
    public void delete(String id) {
        Board board = findById(id);
        try (SearchSession searchSession = searchMapping.createSession()) {
            SearchBoard doc = SearchBoard.of(board);
            searchSession.indexingPlan().delete(doc);
        }
    }
}
