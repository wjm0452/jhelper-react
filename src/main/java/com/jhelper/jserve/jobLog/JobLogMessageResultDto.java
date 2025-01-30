package com.jhelper.jserve.jobLog;

import java.util.List;

import com.jhelper.jserve.jobLog.entity.JobLogMessage;

import lombok.Data;

@Data
public class JobLogMessageResultDto {
    private int jobId;
    private String state;
    private List<JobLogMessage> logMessages;
}
