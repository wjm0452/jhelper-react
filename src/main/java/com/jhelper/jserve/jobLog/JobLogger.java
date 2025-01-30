package com.jhelper.jserve.jobLog;

import java.io.Closeable;

public interface JobLogger extends Closeable {
    public int getId();

    public void log(String message);
}
