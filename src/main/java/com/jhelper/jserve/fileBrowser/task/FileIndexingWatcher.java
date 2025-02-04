package com.jhelper.jserve.fileBrowser.task;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class FileIndexingWatcher {

    public static interface FileWatcherCallback {
        public void call(List<WatchEvent<?>> events);
    }

    @Async
    public void watch(Path path, FileWatcherCallback fileWatcherCallback) {

        WatchService watchService = watcher(path);

        try {
            while (true) {
                WatchKey watchKey = watchService.take();
                List<WatchEvent<?>> events = watchKey.pollEvents();
                List<WatchEvent<?>> filteredEvents = events.stream()
                        .filter(event -> event.kind() != StandardWatchEventKinds.OVERFLOW).toList();

                if (filteredEvents.size() > 0) {
                    fileWatcherCallback.call(filteredEvents);
                }

                if (!reset(watchService, watchKey)) {
                    watchService = watcher(path);
                }
            }
        } catch (InterruptedException e) {
        }
    }

    private boolean reset(WatchService watchService, WatchKey watchKey) {

        if (!watchKey.reset()) {
            try {
                watchService.close();
            } catch (IOException e) {
            }

            try {
                Thread.sleep(1000 * 5);
            } catch (InterruptedException e) {
            }

            return false;
        }

        return true;
    }

    private WatchService watcher(Path path) {
        try {
            WatchService watchService = FileSystems.getDefault().newWatchService();
            path.register(watchService, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_DELETE,
                    StandardWatchEventKinds.ENTRY_MODIFY, StandardWatchEventKinds.OVERFLOW);

            return watchService;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
