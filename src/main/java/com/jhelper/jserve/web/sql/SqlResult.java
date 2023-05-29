package com.jhelper.jserve.web.sql;

import lombok.Data;

@Data
public class SqlResult {
    private String[] columnNames;
    private Object[][] result;
}
