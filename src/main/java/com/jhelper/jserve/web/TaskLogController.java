package com.jhelper.jserve.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jhelper.jserve.task.entity.TaskLog;
import com.jhelper.jserve.task.TaskLogService;

@RestController
@RequestMapping("/api/task-logs")
public class TaskLogController {

    @Autowired
    private TaskLogService taskLogService;

    @GetMapping
    public TaskLog getJobLog(@RequestParam int id, @RequestParam(required = false, defaultValue = "0") int start) {
        return taskLogService.getJobLog(id, start);
    }
}
