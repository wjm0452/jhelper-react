package com.jhelper.jserve.fileBrowser;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class FileDto {
    private FileType type;
    private String name;
    private String path;
    private String owner;
    private long size;
    private LocalDateTime lastModifiedTime;
    private boolean hidden;
}
