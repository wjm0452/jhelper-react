package com.jhelper.jserve.web.sql.dataloader.model;

import lombok.Data;

@Data
public class SourceInfoVO {
    private String name;
    private String owner;
    private String tableName;
    private String query;
}
