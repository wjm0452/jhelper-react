package com.jhelper.jserve.board.entity;

import java.io.Serializable;
import java.sql.Types;
import java.time.LocalDateTime;

import org.hibernate.annotations.Comment;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.DocumentId;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity(name = "board")
@Comment(value = "게시판")
@AllArgsConstructor
@NoArgsConstructor
public class Board implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    @Comment(value = "id")
    @DocumentId
    private String id;

    @Column(name = "category")
    @Comment(value = "카테고리")
    @KeywordField
    private String category;

    @Column(name = "title")
    @Comment(value = "제목")
    @FullTextField
    private String title;

    @Lob
    @JdbcTypeCode(Types.LONGVARCHAR)
    @Column(name = "content")
    @Comment(value = "내용")
    @FullTextField
    private String content;

    @Column(name = "register_id")
    @Comment(value = "등록자ID")
    @KeywordField
    private String registerId;

    @Column(name = "register_date")
    @Comment(value = "등록일시")
    @GenericField
    private LocalDateTime registerDate;
}
