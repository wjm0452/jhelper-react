package com.jhelper.jserve.fileBrowser.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.search.engine.search.predicate.dsl.BooleanPredicateClausesStep;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;

import com.jhelper.export.excel.SimpleCell;
import com.jhelper.export.excel.SimpleExcelExporter;
import com.jhelper.jserve.fileBrowser.FileDto;
import com.jhelper.jserve.fileBrowser.FileSearchDto;
import com.jhelper.jserve.fileBrowser.FileType;
import com.jhelper.jserve.fileBrowser.entity.FileIndex;

@Service
public class FileBrowserService {

    @Value("${jhelper.file-browser.rootPath}")
    private String rootPath;

    @Value("${jhelper.file-browser.trashPath}")
    private String trashPath;

    private AntPathMatcher pathMatcher = new AntPathMatcher();

    @Autowired
    private SearchSession searchSession;

    public Path getRootPath() {
        return Paths.get(rootPath).toAbsolutePath();
    }

    public Path getTrashPath() {
        return Paths.get(trashPath).toAbsolutePath();
    }

    public Path getFile(String path) throws AccessDeniedException {

        Path file = Paths.get(path);
        if (!file.startsWith(getRootPath())) {
            throw new AccessDeniedException("Access denied - " + path);
        }
        return file;
    }

    public List<Path> getFiles(List<String> files) throws IOException {
        List<Path> paths = new ArrayList<>();
        for (String filePath : files) {
            paths.add(getFile(filePath));
        }

        return paths;
    }

    public FileDto toFileDto(Path path) {
        File file = path.toFile();
        FileDto fileDto = FileDto.builder().type(file.isDirectory() ? FileType.DIR : FileType.FILE).name(file.getName())
                .path(path.toAbsolutePath().toString()).size(file.length()).hidden(file.isHidden()).build();

        Instant instant = Instant.ofEpochMilli(file.lastModified());
        fileDto.setLastModifiedTime(instant.atZone(ZoneId.systemDefault()).toLocalDateTime());

        try {
            fileDto.setOwner(Files.getOwner(path).getName());
        } catch (IOException e) {
        }

        return fileDto;
    }

    private boolean filterFile(Path file, FileSearchDto fileSearch) {

        String type = fileSearch.getType();

        if (FileType.isDir(type) && !Files.isDirectory(file)) {
            return false;
        } else if (FileType.isFile(type) && !Files.isRegularFile(file)) {
            return false;
        }

        if (fileSearch.getFrom() != null) {
            LocalDateTime lastModified = Instant.ofEpochMilli(file.toFile().lastModified())
                    .atZone(ZoneOffset.systemDefault()).toLocalDateTime();

            if (lastModified.compareTo(fileSearch.getFrom()) < 0) {
                return false;
            }
        }

        if (fileSearch.getTo() != null) {
            LocalDateTime lastModified = Instant.ofEpochMilli(file.toFile().lastModified())
                    .atZone(ZoneOffset.systemDefault()).toLocalDateTime();

            if (lastModified.compareTo(fileSearch.getTo()) > 0) {
                return false;
            }
        }

        if (StringUtils.isNotEmpty(fileSearch.getName())) {
            if (!patternMatch(file, fileSearch.getName())) {
                return false;
            }
        }

        if (StringUtils.isNotEmpty(fileSearch.getExclusionName())) {
            if (patternMatch(file, fileSearch.getExclusionName())) {
                return false;
            }
        }

        return true;
    }

    private boolean patternMatch(Path file, String pattern) {
        String fileName = file.getFileName().toString();
        if (StringUtils.containsIgnoreCase(fileName, pattern) || pathMatcher.match(pattern, fileName)) {
            return true;
        }

        return false;
    }

    private List<FileDto> searchIndexingFiles(FileSearchDto fileSearch) {

        List<FileIndex> searchResults = searchSession.search(FileIndex.class).where(f -> {

            BooleanPredicateClausesStep<?> predicate = f.bool();

            if (fileSearch.getFrom() != null) {
                predicate = predicate.must(f.range().field("lastModifiedTime").greaterThan(fileSearch.getFrom()));
            }

            if (fileSearch.getTo() != null) {
                predicate = predicate.must(f.range().field("lastModifiedTime").lessThan(fileSearch.getFrom()));
            }

            if (StringUtils.isNotEmpty(fileSearch.getName())) {
                predicate = predicate.must(f.match().field("name").matching(fileSearch.getName()));
            }

            if (StringUtils.isNotEmpty(fileSearch.getExclusionName())) {
                predicate = predicate.mustNot(f.match().field("name").matching(fileSearch.getExclusionName()));
            }

            return predicate;
        }).sort(f -> f.field("path").desc()).fetchAllHits();

        return searchResults.stream().map(fileIndex -> {
            String path = fileIndex.getPath();

            return toFileDto(Paths.get(path));
        }).toList();
    }

    public List<FileDto> searchFiles(FileSearchDto fileSearch) throws IOException {

        String path = fileSearch.getPath();

        // if ("/".equals(path)) {
        // path = "";
        // }

        Path dir = getFile(path);

        if (!Files.isDirectory(dir)) {
            throw new AccessDeniedException("is not directory");
        }

        if (fileSearch.isIncludeSubDirs()) {
            return searchIndexingFiles(fileSearch);
        }

        return Files.list(dir).filter(file -> Files.isReadable(file)).filter(file -> filterFile(file, fileSearch))
                .map(p -> toFileDto(p)).toList();
    }

    public File export(FileSearchDto fileSearch) throws IOException {
        List<FileDto> files = searchFiles(fileSearch);

        try (final SimpleExcelExporter simpleExcelExporter = new SimpleExcelExporter();) {

            final List<String> headers = Arrays.asList("type", "name", "path", "owner", "size", "lastModifiedTime");

            List<SimpleCell[]> rows = files.stream()
                    .map(file -> simpleExcelExporter.toSimpleCell(new Object[] { file.getType(), file.getName(),
                            file.getPath(), file.getOwner(), file.getSize(), file.getLastModifiedTime() }))
                    .toList();

            simpleExcelExporter.writeHead(headers.toArray(new String[0]));
            simpleExcelExporter.writeData(rows);

            for (int i = 0; i < headers.size(); i++) {
                simpleExcelExporter.getExcelWriter().autoSizeColumn(i);
            }

            return simpleExcelExporter.export();
        }
    }
}
