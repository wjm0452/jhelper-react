package com.jhelper.jserve.web.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.Data;

@Data
@Entity(name = "qna")
public class Qna {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String registerId;

    private Date registerDate;

    private Integer parentId;

    private String title;

    private String content;
}
