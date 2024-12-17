package com.jhelper.jserve.web.entity;

import org.hibernate.annotations.Comment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.Data;

@Data
@Entity(name = "cache")
public class Cache {

    @Id
    @Column(name = "key")
    @Comment(value = "key")
    private String key;

    @Column(name = "value")
    @Comment(value = "value")
    private String value;
}
