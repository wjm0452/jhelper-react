package com.jhelper.jserve.fileBrowser.properties;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@Data
@ConfigurationProperties("jhelper.file-browser.board")
public class FileBrowserBoardProperties {
    private List<String> exclusions;
}
