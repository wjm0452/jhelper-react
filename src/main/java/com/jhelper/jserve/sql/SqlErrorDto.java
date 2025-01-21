package com.jhelper.jserve.sql;

import lombok.Data;

@Data
public class SqlErrorDto {
    private String sqlState;
    private String errorMessage;
}
