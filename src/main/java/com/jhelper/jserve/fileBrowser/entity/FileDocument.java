package com.jhelper.jserve.fileBrowser.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;

@Data
@Document(indexName = "file")
public class FileDocument {

    @Id
    private String id;

    @Field(type = FieldType.Text, analyzer = "app_analyzer", searchAnalyzer = "app_analyzer")
    private String name;

    @Field(type = FieldType.Text, analyzer = "app_analyzer", searchAnalyzer = "app_analyzer")
    private String path;

    @Field(type = FieldType.Keyword)
    private String owner;

    @Field(type = FieldType.Long)
    private long size;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime lastModifiedTime;

    @Field(type = FieldType.Boolean)
    private boolean directory;

    @Field(type = FieldType.Boolean)
    private boolean hidden;
}
