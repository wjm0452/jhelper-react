package com.jhelper.jserve.web;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jhelper.jserve.fileBrowser.FileIndexingResultDto;
import com.jhelper.jserve.fileBrowser.FilePathsDto;
import com.jhelper.jserve.fileBrowser.service.FileIndexService;

@RestController
@RequestMapping("/api/file-index")
public class FileIndexController {

    @Autowired
    private FileIndexService fileIndexService;

    @PostMapping
    public FileIndexingResultDto indxing(@RequestBody FilePathsDto filePathsDto) throws IOException {
        return fileIndexService.indexing(filePathsDto.getFiles());
    }

    @PostMapping("/terminate")
    public void terminateIndexing() throws IOException {
        fileIndexService.terminateIndexing();
    }

    @DeleteMapping
    public void deleteIndexing() throws IOException {
        fileIndexService.deleteIndexing();
    }

}
