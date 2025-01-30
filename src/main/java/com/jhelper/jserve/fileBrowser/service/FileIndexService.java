package com.jhelper.jserve.fileBrowser.service;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.fileBrowser.FileIndexingResultDto;
import com.jhelper.jserve.fileBrowser.task.FileIndexer;

@Service
public class FileIndexService {

    @Autowired
    private FileBrowserService fileBrowserService;

    @Autowired
    private FileIndexer fileIndexer;

    public FileIndexingResultDto indexing(List<String> files) throws IOException {
        List<Path> fileList = fileBrowserService.getFiles(files);
        String jobId = fileIndexer.asyncIndexing(fileList);

        FileIndexingResultDto resultDto = new FileIndexingResultDto();
        resultDto.setJobId(jobId);

        return resultDto;
    }

    public void terminateIndexing() throws IOException {
        fileIndexer.terminate();
    }
}
