package com.jhelper.jserve.sql;

import lombok.Data;

@Data
public class SqlResultDto {
    private String[] columnNames;
    private Object[][] result;
    private boolean hasNext = false;
    private int count;

    public SqlResultDto() {
        columnNames = new String[0];
        result = new Object[0][0];
    }
}
