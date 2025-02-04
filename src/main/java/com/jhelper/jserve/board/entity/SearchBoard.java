package com.jhelper.jserve.board.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import org.hibernate.search.engine.backend.types.Projectable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.DocumentId;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.SearchEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
// @SearchEntity
// @Indexed
@AllArgsConstructor
@NoArgsConstructor
public class SearchBoard implements Serializable {

    @DocumentId
    private String id;

    @KeywordField(projectable = Projectable.YES)
    private String category;

    @FullTextField(projectable = Projectable.YES)
    private String title;

    @FullTextField(projectable = Projectable.YES)
    private String content;

    @KeywordField(projectable = Projectable.YES)
    private String registerId;

    @GenericField(projectable = Projectable.YES)
    private LocalDateTime registerDate;

    static public SearchBoard of(Board board) {
        SearchBoard doc = new SearchBoard();
        doc.setId(board.getId());
        doc.setCategory(board.getCategory());
        doc.setTitle(board.getTitle());
        doc.setContent(board.getContent());
        doc.setRegisterId(board.getRegisterId());
        doc.setRegisterDate(board.getRegisterDate());

        return doc;
    }

    public Board toBoard() {
        Board board = new Board();
        board.setId(getId());
        board.setCategory(getCategory());
        board.setTitle(getTitle());
        board.setContent(getContent());
        board.setRegisterId(getRegisterId());
        board.setRegisterDate(getRegisterDate());

        return board;
    }
}
