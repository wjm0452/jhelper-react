package com.jhelper.jserve.web.entity;

import java.util.Date;

import org.hibernate.annotations.Comment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.Data;

@Data
@Entity(name = "board")
public class Board {

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
    private Date registerDate;

    @Column(name = "title")
    @Comment(value = "제목")
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    @Comment(value = "내용")
    private String content;
}
