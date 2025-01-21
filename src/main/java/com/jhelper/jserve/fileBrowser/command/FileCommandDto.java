package com.jhelper.jserve.fileBrowser.command;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class FileCommandDto implements Serializable {
    private String path;
    private List<String> files;
}
