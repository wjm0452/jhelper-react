package com.jhelper.jserve.web.sql.model;

import lombok.Data;

@Data
public class SqlResult {
    private String[] columnNames;
    private Object[][] result;
    private boolean hasNext = false;
}
