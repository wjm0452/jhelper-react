package com.jhelper.jserve.web.fileCommand;

import java.io.File;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileDownloadDto {
    private String fileName;
    private File file;
}
