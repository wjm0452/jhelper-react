package com.jhelper.jserve.common;

public class ProgramException extends Exception {

    private String state;

    public ProgramException(String message) {
        super(message);
    }

    public ProgramException(String state, String message) {
        super(message);
        this.state = state;
    }

    public String getState() {
        return state;
    }
}
