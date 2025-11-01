package com.jhelper.jserve.task;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jhelper.jserve.task.entity.TaskLog;
import com.jhelper.jserve.task.entity.TaskLogMessage;

@Service
public class TaskLogService {

    @Autowired
    private TaskLogRepository taskLogRepository;

    public TaskLog findTaskLogById(int id) {
        return taskLogRepository.findById(id).orElse(new TaskLog());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public TaskLog save(TaskLog jobLog) {
        return taskLogRepository.saveAndFlush(jobLog);
    }

    public TaskLog getJobLog(int id, int start) {

        TaskLog taskLog = taskLogRepository.findById(id).orElse(new TaskLog());
        List<TaskLogMessage> messages = taskLog.getTaskLogMessages();

        TaskLog result = new TaskLog();
        result.setId(taskLog.getId());
        result.setStartDate(taskLog.getStartDate());
        result.setEndDate(taskLog.getEndDate());
        result.setState(taskLog.getState());
        result.setTaskLogMessages(messages.subList(start, messages.size()));

        return result;
    }
}
