package com.jhelper.jserve.task.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import org.hibernate.annotations.Comment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity(name = "taskLogMessage")
@Comment(value = "taskLogMessage")
@IdClass(TaskLogMessage.PK.class) // 필수
public class TaskLogMessage {

    @Id
    @Column(name = "id")
    @Comment(value = "id")
    private Integer id;

    @Id
    @Column(name = "no")
    @Comment(value = "no")
    private Integer no;

    @Column(name = "message")
    @Comment(value = "message")
    private String message;

    @Column(name = "logging_date")
    @Comment(value = "로그작성일시")
    LocalDateTime loggingDate;

    @PrePersist
    public void prePersist() {
        loggingDate = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        if (loggingDate == null) {
            loggingDate = LocalDateTime.now();
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    static public class PK implements Serializable {
        private Integer id;
        private Integer no;
    }
}
