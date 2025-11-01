package com.jhelper.jserve.task.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Comment;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Data;

@Data
@Entity(name = "taskLog")
@Comment(value = "taskLog")
public class TaskLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    @Comment(value = "id")
    private Integer id;

    @Column(name = "state")
    @Comment(value = "state")
    private String state;

    @Column(name = "start_date")
    @Comment(value = "시작일시")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    @Comment(value = "종료일시")
    private LocalDateTime endDate;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "id", referencedColumnName = "id")
    @OrderBy("id asc, no asc")
    private List<TaskLogMessage> taskLogMessages = new ArrayList<>();

    @PrePersist
    public void prePersist() {

    }

    @PreUpdate
    public void preUpdate() {

    }

    public void log(String message) {
        TaskLogMessage taskLogMessage = new TaskLogMessage();
        taskLogMessage.setId(id);
        taskLogMessage.setNo(taskLogMessages.size() + 1);
        taskLogMessage.setMessage(message);
        taskLogMessages.add(taskLogMessage);
    }
}
