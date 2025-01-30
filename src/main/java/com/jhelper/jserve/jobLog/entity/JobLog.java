package com.jhelper.jserve.jobLog.entity;

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
@Entity(name = "jobLog")
@Comment(value = "jobLog")
public class JobLog {

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
    private List<JobLogMessage> jobLogMessages = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        startDate = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        if ("END".equals(state)) {
            endDate = LocalDateTime.now();
        }
    }

    public void log(String message) {
        JobLogMessage jobLogMessage = new JobLogMessage();
        jobLogMessage.setId(id);
        jobLogMessage.setNo(jobLogMessages.size() + 1);
        jobLogMessage.setMessage(message);
        jobLogMessages.add(jobLogMessage);
    }
}
