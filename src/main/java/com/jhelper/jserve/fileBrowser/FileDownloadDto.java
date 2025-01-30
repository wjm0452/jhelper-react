package com.jhelper.jserve.fileBrowser;

import java.io.File;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileDownloadDto {
    private String fileName;
    private File file;
}
