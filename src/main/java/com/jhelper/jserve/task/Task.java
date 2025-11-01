package com.jhelper.jserve.task;

public interface Task {
    public void execute(TaskContext context) throws Exception;

    public void terminate();
}
