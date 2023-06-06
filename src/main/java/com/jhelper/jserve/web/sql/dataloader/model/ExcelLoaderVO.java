package com.jhelper.jserve.web.sql.dataloader.model;

import lombok.Data;

@Data
public class ExcelLoaderVO {
    private String path;
    private String targetName;
    private String targetOwner;
    private String targetTableName;
    private String[] targetColumns;
}
