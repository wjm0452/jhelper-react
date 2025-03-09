package com.jhelper.jserve.fileBrowser.task;

import java.io.IOException;
import java.nio.file.FileVisitOption;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jhelper.jserve.fileBrowser.entity.FileIndex;
import com.jhelper.jserve.fileBrowser.repository.FileIndexRepository;
import com.jhelper.jserve.jobLog.JobLogService;
import com.jhelper.jserve.jobLog.JobLogger;
import com.jhelper.jserve.task.Task;

public class FileIndexingTask implements Task {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private FileIndexRepository fileIndexRepository;
    private JobLogService jobLogService;
    private List<Path> files;
    private JobLogger jobLogger;

    private boolean isDelete = false;
    private boolean terminate = false;

    public void setFileIndexRepository(FileIndexRepository fileIndexRepository) {
        this.fileIndexRepository = fileIndexRepository;
    }

    public void setJobLogService(JobLogService jobLogService) {
        this.jobLogService = jobLogService;
        this.jobLogger = jobLogService.getJobLogger();
    }

    public void terminate() {
        this.terminate = true;
    }

    public boolean isTerminate() {
        return terminate;
    }

    public void setFiles(List<Path> files) {
        this.files = files;
    }

    public String getTaskId() {
        return String.format("%d", jobLogger.getId());
    }

    public void setDelete() {
        isDelete = true;
    }

    public void execute() {
        try {
            indexing();
        } catch (Exception e) {
            logger.error("indexing error", e);
            jobLogger.log(String.format("[indexing] error - %s", e.getMessage()));
        }
    }

    private void indexing() throws IOException {

        try {
            for (Path f : files) {
                indexing(f);
            }
        } finally {
            if (jobLogger != null) {
                jobLogger.close();
            }
        }
    }

    private void indexing(Path path) throws IOException {

        List<Path> waitFiles = new ArrayList<>();

        Files.walkFileTree(path, EnumSet.noneOf(FileVisitOption.class), 255, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {

                if (isTerminate()) {
                    throw new RuntimeException("terminated");
                }

                waitFiles.add(file);

                if (waitFiles.size() >= 100) {
                    saveFiles(waitFiles);
                    waitFiles.clear();
                }

                return FileVisitResult.CONTINUE;
            }
        });

        if (isTerminate()) {
            throw new RuntimeException("terminated");
        }

        if (waitFiles.size() > 0) {
            saveFiles(waitFiles);
        }
    }

    private void saveFiles(List<Path> files) {
        List<FileIndex> fileIndexes = files.stream().map(path -> FileIndex.of(path)).toList();

        List<String> deleteDirs = fileIndexes.stream().filter(fileIndex -> fileIndex.isDirectory())
                .map(fileIndex -> fileIndex.getPath()).toList();

        if (deleteDirs.size() > 0) {
            // 디렉토리의 하위 데이터를 삭제 한다.
            fileIndexRepository.deleteAllByParentPath(deleteDirs);
        }

        if (isDelete) {
            fileIndexRepository.deleteAll(fileIndexes);
        } else {
            fileIndexRepository.saveAll(fileIndexes);
        }

        if (jobLogger != null) {
            fileIndexes.forEach(file -> {
                jobLogger.log(String.format("[indexing] %s %s", isDelete ? "[delete]" : "[update]", file.getPath()));
            });
        }
    }
}
