package com.jhelper.jserve.task;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.hibernate.resource.transaction.spi.TransactionStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import com.jhelper.jserve.task.entity.TaskLog;

@Component
public class TaskExecutor extends ThreadPoolExecutor {

    private List<Task> tasks = Collections.synchronizedList(new ArrayList<>());

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Autowired
    private TaskLogService taskLogService;

    public TaskExecutor() {
        this(1, 1);
    }

    public TaskExecutor(int corePoolSize, int maximumPoolSize) {
        super(corePoolSize, maximumPoolSize, 60, TimeUnit.SECONDS, new LinkedBlockingQueue<>());
    }

    @Override
    protected void beforeExecute(Thread t, Runnable r) {
    }

    @Override
    protected void afterExecute(Runnable r, Throwable t) {
    }

    public TaskContext execute(Task task) {

        TaskContext context = new TaskContext();

        transactionTemplate.execute(status -> {
            TaskLog taskLog = new TaskLog();
            taskLog.setState("WAIT");
            taskLog = taskLogService.save(taskLog);

            taskLog.log("task waiting.");
            taskLog = taskLogService.save(taskLog);

            context.setTaskId(taskLog.getId());
            return TransactionStatus.COMMITTED;
        });

        execute(() -> {
            tasks.add(task);

            transactionTemplate.execute(status -> {
                TaskLog taskLog = taskLogService.findTaskLogById(context.getTaskId());
                taskLog.setState("RUNNING");
                taskLog.setStartDate(LocalDateTime.now());
                taskLog.log("task start.");

                return TransactionStatus.COMMITTED;
            });

            try {
                transactionTemplate.execute(status -> {
                    try {
                        // execute task
                        task.execute(context);

                        TaskLog taskLog = taskLogService.findTaskLogById(context.getTaskId());
                        taskLog.setState("FINISHED");
                        taskLog.setEndDate(LocalDateTime.now());
                        taskLog.log("task finished.");
                    } catch (Exception e) {
                        TaskLog taskLog = taskLogService.findTaskLogById(context.getTaskId());
                        taskLog.setState("ERROR");
                        taskLog.setEndDate(LocalDateTime.now());
                        taskLog.log(String.format("task error - %s", e.getMessage()));
                    }

                    return TransactionStatus.COMMITTED;
                });
            } finally {
                tasks.remove(task);
            }
        });

        return context;

    }

    public void terminate() {
        tasks.forEach(task -> task.terminate());
        tasks.clear();
    }
}
