package com.jhelper.jserve.board.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;

@Data
@Document(indexName = "board")
public class BoardDocument implements Serializable {

    @Id
    private Integer id;

    @Field(type = FieldType.Keyword)
    private String registerId;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime registerDate;

    @Field(type = FieldType.Keyword)
    private String category;

    @Field(type = FieldType.Text, analyzer = "app_analyzer", searchAnalyzer = "app_analyzer")
    private String title;

    @Field(type = FieldType.Text, analyzer = "app_analyzer", searchAnalyzer = "app_analyzer")
    private String content;

    static public BoardDocument of(Board board) {
        BoardDocument doc = new BoardDocument();
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
