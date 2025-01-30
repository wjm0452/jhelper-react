package com.jhelper.jserve.task;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class TaskExecutor2 {

    ReentrantLock workingLock = new ReentrantLock();
    private BlockingQueue<Task> waitingQueue = new LinkedBlockingQueue<>();
    private BlockingQueue<Task> runningQueue = new LinkedBlockingQueue<>();

    public void execute(Task task) {

        if (isRunning()) {
            waitingQueue.offer(task);
        } else {

            workingLock.lock();
            try {
                Thread th = new Thread(() -> {
                    runTask(task);

                    Task t = null;
                    try {
                        while ((t = waitingQueue.poll(1, TimeUnit.SECONDS)) != null) {
                            runTask(t);
                        }
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                });

                th.setDaemon(false);
                th.start();
            } finally {
                workingLock.unlock();
            }
        }
    }

    private void runTask(Task task) {
        runningQueue.add(task);
        try {
            task.execute();
        } finally {
            runningQueue.remove(task);
        }
    }

    private boolean isRunning() {
        return runningQueue.size() > 0;
    }

    public int getWaitingCount() {
        return waitingQueue.size();
    }

    public void terminate() {
        workingLock.lock();
        try {
            waitingQueue.clear();
            Task t = null;
            while ((t = runningQueue.poll()) != null) {
                t.terminate();
            }
        } finally {
            workingLock.unlock();
        }
    }
}
