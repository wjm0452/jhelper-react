package com.jhelper.jserve.sql;

import lombok.Data;

@Data
public class QueryDto {
    private String query;
    private String name;
    private String[] params;
    private int fetchSize = -1;
}
