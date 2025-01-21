package com.jhelper.jserve.sql.entity;

import java.io.Serializable;

import org.hibernate.annotations.Comment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity(name = "tableBookmark")
@Comment(value = "테이블 북마크")
@NoArgsConstructor
@IdClass(TableBookmark.PK.class) // 필수
public class TableBookmark {
    @Id
    @Column(name = "name")
    @Comment(value = "name")
    private String name;

    @Id
    @Column(name = "owner")
    @Comment(value = "owner")
    private String owner;

    @Id
    @Column(name = "tableName")
    @Comment(value = "tableName")
    private String tableName;

    @Column(name = "comments")
    @Comment(value = "comments")
    private String comments;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    static public class PK implements Serializable {
        private String name;
        private String owner;
        private String tableName;
    }
}
