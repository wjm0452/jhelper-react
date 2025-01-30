package com.jhelper.jserve.task;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class TaskExecutor extends ThreadPoolExecutor {

    private List<Task> tasks = Collections.synchronizedList(new ArrayList<>());

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

    public void execute(Task task) {
        execute(() -> {
            tasks.add(task);
            try {
                task.execute();
            } finally {
                tasks.remove(task);
            }
        });
    }

    public void terminate() {
        tasks.forEach(task -> task.terminate());
        tasks.clear();
    }
}
