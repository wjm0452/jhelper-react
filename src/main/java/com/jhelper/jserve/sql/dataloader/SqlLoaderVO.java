package com.jhelper.jserve.sql.dataloader;

import lombok.Data;

@Data
public class SqlLoaderVO {

    private String sourceName;
    private String sourceOwner;
    private String sourceTableName;
    private String sourceQuery;

    private String targetName;
    private String targetOwner;
    private String targetTableName;
    private String[] targetColumns;
}
