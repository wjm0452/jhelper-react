package com.jhelper.jserve.fileBrowser.task;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.StandardWatchEventKinds;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.jhelper.jserve.fileBrowser.repository.FileIndexRepository;
import com.jhelper.jserve.fileBrowser.service.FileBrowserService;
import com.jhelper.jserve.task.TaskExecutor;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Component
public class FileIndexer {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private FileBrowserService fileBrowserService;

    @Autowired
    private FileIndexingWatcher fileWatcher;

    @Autowired
    private FileIndexingTaskFactoryBean fileIndexingJobFactory;

    @Autowired
    private FileIndexRepository fileIndexRepository;

    private TaskExecutor taskExecutor = new TaskExecutor();

    public String asyncIndexing(List<Path> files) throws IOException {
        if (taskExecutor.getActiveCount() > 0) {
            throw new IOException("Indexing is already in progress.");
        }

        return updateIndexing(files);
    }

    private String updateIndexing(List<Path> files) {
        FileIndexingTask fileIndexingTask = fileIndexingJobFactory.getObject();
        fileIndexingTask.setFiles(files);

        taskExecutor.execute(fileIndexingTask);

        return fileIndexingTask.getTaskId();
    }

    private String deleteIndexing(List<Path> files) {
        FileIndexingTask fileIndexingTask = fileIndexingJobFactory.getObject();
        fileIndexingTask.setFiles(files);
        fileIndexingTask.setDelete();

        taskExecutor.execute(fileIndexingTask);

        return fileIndexingTask.getTaskId();
    }

    public void deleteAll() {
        fileIndexRepository.deleteAll();
    }

    public void terminate() {
        taskExecutor.terminate();
    }

    @PostConstruct
    private void initialize() throws IOException {
        fileWatcher.watch(fileBrowserService.getRootPath(), watchEvents -> {
            try {
                // delete
                List<Path> deleteFiles = watchEvents.stream()
                        .filter(watchEvent -> watchEvent.kind() == StandardWatchEventKinds.ENTRY_DELETE)
                        .map(watchEvent -> (Path) watchEvent.context()).toList();

                deleteIndexing(deleteFiles);

                // update
                List<Path> updateFiles = watchEvents.stream()
                        .filter(watchEvent -> watchEvent.kind() != StandardWatchEventKinds.ENTRY_DELETE)
                        .map(watchEvent -> (Path) watchEvent.context()).toList();

                updateIndexing(updateFiles);
            } catch (Exception e) {
                logger.error("initialize error", e);
            }
        });
    }

    @PreDestroy
    private void releaseFileWatch() {
        // fileWatcher.stop();
    }

}
