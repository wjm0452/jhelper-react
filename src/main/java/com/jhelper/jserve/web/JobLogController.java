package com.jhelper.jserve.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jhelper.jserve.jobLog.JobLogService;
import com.jhelper.jserve.jobLog.entity.JobLog;

@RestController
@RequestMapping("/api/job-log")
public class JobLogController {

    @Autowired
    private JobLogService jobLogService;

    @GetMapping
    public JobLog getJobLog(@RequestParam int id, @RequestParam(required = false, defaultValue = "0") int start) {
        return jobLogService.getJobLog(id, start);
    }
}
