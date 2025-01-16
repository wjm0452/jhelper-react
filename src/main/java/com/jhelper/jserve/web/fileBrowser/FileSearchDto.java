package com.jhelper.jserve.web.fileBrowser;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FileSearchDto implements Serializable {
    private String path;
    private String type;
    private String name;
    private LocalDateTime from;
    private LocalDateTime to;
    private String exclusionName;
    private boolean includeSubDirs;
}
