package com.jhelper.jserve.sql.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.Comment;
import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.DocumentId;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity(name = "sqlHistory")
@Comment(value = "SQL 실행 기록")
@NoArgsConstructor
public class SqlHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    @Comment(value = "id")
    @DocumentId
    private Integer id;

    @Column(name = "name")
    @Comment(value = "연결 이름")
    private String name;

    @Column(name = "query", columnDefinition = "TEXT")
    @Comment(value = "쿼리")
    private String query;

    @Column(name = "register_date")
    @Comment(value = "등록일시")
    @GenericField(sortable = Sortable.YES)
    private LocalDateTime registerDate;
}
