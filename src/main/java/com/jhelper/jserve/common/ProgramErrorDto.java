package com.jhelper.jserve.common;

import lombok.Data;

@Data
public class ProgramErrorDto {
    private String state;
    private String detail;

    public ProgramErrorDto(String detail) {
        this.detail = detail;
    }

    public ProgramErrorDto(String state, String detail) {
        this.state = state;
        this.detail = detail;
    }
}
