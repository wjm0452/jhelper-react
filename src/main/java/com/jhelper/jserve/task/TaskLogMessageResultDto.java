package com.jhelper.jserve.task;

import java.util.List;

import com.jhelper.jserve.task.entity.TaskLogMessage;

import lombok.Data;

@Data
public class TaskLogMessageResultDto {
    private int jobId;
    private String state;
    private List<TaskLogMessage> logMessages;
}
