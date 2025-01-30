package com.jhelper.jserve.fileBrowser;

import lombok.Data;

@Data
public class FileBoardResultDto {
    private String file;
    private boolean isSaved;
    private String message;
    private boolean isError;
    private String errorMessage;
}
