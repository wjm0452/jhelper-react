package com.jhelper.jserve.fileBrowser;

import java.io.Serializable;

import lombok.Data;

@Data
public class FileRenameDto implements Serializable {
    private String path;
    private String changeName;
}
