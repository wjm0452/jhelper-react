package com.jhelper.jserve.web.fileCommand;

import java.io.Serializable;

import lombok.Data;

@Data
public class FileNewDto implements Serializable {
    private String path;
    private String type;
    private String name;
}
