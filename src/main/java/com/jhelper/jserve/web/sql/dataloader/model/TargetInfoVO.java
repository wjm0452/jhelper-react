package com.jhelper.jserve.web.sql.dataloader.model;

import lombok.Data;

@Data
public class TargetInfoVO {
    private String name;
    private String owner;
    private String tableName;
    private String[] columns;
}
