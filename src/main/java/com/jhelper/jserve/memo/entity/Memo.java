package com.jhelper.jserve.memo.entity;

import java.sql.Types;
import java.time.LocalDateTime;

import org.hibernate.annotations.Comment;
import org.hibernate.annotations.JdbcTypeCode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Data;

@Data
@Entity(name = "memo")
@Comment(value = "메모")
public class Memo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    @Comment(value = "id")
    private Integer id;

    @Column(name = "register_id")
    @Comment(value = "등록자ID")
    private String registerId;

    @Column(name = "register_date")
    @Comment(value = "등록일시")
    private LocalDateTime registerDate;

    @Lob
    @JdbcTypeCode(Types.LONGVARCHAR)
    @Column(name = "content")
    @Comment(value = "내용")
    private String content;
}
