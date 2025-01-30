package com.jhelper.jserve.jobLog;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jhelper.jserve.jobLog.entity.JobLog;
import com.jhelper.jserve.jobLog.entity.JobLogMessage;

@Service
public class JobLogService {

    @Autowired
    private JobLogRepository jobLogRepository;

    @Transactional
    public JobLogger getJobLogger() {
        JobLog jobLog = createJogLob();
        return new JobLogger() {
            public int getId() {
                return jobLog.getId();
            }

            @Transactional
            @Override
            public void log(String message) {

                if (!"RUNNING".equals(jobLog.getState())) {
                    jobLog.setState("RUNNING");
                }

                jobLog.log(message);
                jobLogRepository.save(jobLog);
            }

            @Transactional
            @Override
            public void close() throws IOException {
                jobLog.setState("END");
                jobLogRepository.saveAndFlush(jobLog);
            }
        };
    }

    private JobLog createJogLob() {
        JobLog jobLog = new JobLog();
        jobLog.setState("START");
        return jobLogRepository.saveAndFlush(jobLog);
    }

    @Transactional
    public JobLog save(JobLog jobLog) {
        return jobLogRepository.saveAndFlush(jobLog);
    }

    public JobLog getJobLog(int id, int start) {

        JobLog jobLog = jobLogRepository.findById(id).orElse(new JobLog());
        List<JobLogMessage> messages = jobLog.getJobLogMessages();

        JobLog result = new JobLog();
        result.setId(jobLog.getId());
        result.setStartDate(jobLog.getStartDate());
        result.setEndDate(jobLog.getEndDate());
        result.setState(jobLog.getState());
        result.setJobLogMessages(messages.subList(start, messages.size()));

        return result;
    }
}
