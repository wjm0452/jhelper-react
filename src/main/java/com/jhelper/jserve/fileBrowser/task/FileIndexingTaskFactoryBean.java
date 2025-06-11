package com.jhelper.jserve.fileBrowser.task;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.jhelper.jserve.fileBrowser.repository.FileIndexRepository;
import com.jhelper.jserve.jobLog.JobLogService;

@Component
public class FileIndexingTaskFactoryBean implements FactoryBean<FileIndexingTask> {

    @Autowired
    private FileIndexRepository fileIndexRepository;

    @Autowired
    private JobLogService jobLogService;

    @Override
    public FileIndexingTask getObject() {
        FileIndexingTask task = new FileIndexingTask();
        task.setFileIndexRepository(fileIndexRepository);
        task.setJobLogger(jobLogService.getJobLogger());

        return task;
    }

    @Override
    public Class<?> getObjectType() {
        return FileIndexingTask.class;
    }

    @Override
    public boolean isSingleton() {
        return false;
    }
}
