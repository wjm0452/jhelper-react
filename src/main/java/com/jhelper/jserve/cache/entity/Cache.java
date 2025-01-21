package com.jhelper.jserve.cache.entity;

import org.hibernate.annotations.Comment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity(name = "cache")
@Comment(value = "캐시")
public class Cache {

    @Id
    @Column(name = "name")
    @Comment(value = "name")
    private String name;

    @Column(name = "value")
    @Comment(value = "value")
    private String value;
}
