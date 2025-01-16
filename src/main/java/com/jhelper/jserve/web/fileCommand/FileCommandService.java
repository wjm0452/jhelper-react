package com.jhelper.jserve.web.fileCommand;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.FileExistsException;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jhelper.export.excel.SimpleCell;
import com.jhelper.export.excel.SimpleExcelExporter;
import com.jhelper.jserve.web.fileBrowser.FileBrowserService;
import com.jhelper.jserve.web.fileBrowser.FileDto;
import com.jhelper.jserve.web.fileBrowser.FileType;

@Service
public class FileCommandService {

    @Autowired
    private FileBrowserService fileBrowserService;

    private String trashPath = "c:\\tmp\\jhelper\\trash";

    public Path getFile(String path) throws AccessDeniedException {
        return fileBrowserService.getFile(path);
    }

    public List<Path> getFiles(List<String> files) throws IOException {
        List<Path> paths = new ArrayList<>();
        for (String filePath : files) {
            paths.add(getFile(filePath));
        }

        return paths;
    }

    public Path getTrashPath() {
        return Paths.get(trashPath);
    }

    public Path createTempFile(String prefix, String suffix) throws IOException {
        return Files.createTempFile(getTrashPath(), prefix, suffix);
    }

    public void copyFiles(List<String> files, String path) throws IOException {

        Path targetPath = getFile(path);

        if (!Files.isDirectory(targetPath)) {
            throw new IOException("path is not directory");
        }

        for (String f : files) {
            Path file = getFile(f);
            if (Files.exists(targetPath.resolve(file.getFileName()))) {
                throw new FileExistsException(String.format("File element in parameter '%s' already exists: '%s'",
                        file.getFileName().toString(), file.toFile()));
            }

            FileUtils.copyToDirectory(getFile(f).toFile(), targetPath.toFile());
        }
    }

    public void moveFiles(List<String> files, String path) throws IOException {

        Path targetPath = getFile(path);

        if (!Files.isDirectory(targetPath)) {
            throw new IOException("path is not directory");
        }

        for (String f : files) {
            FileUtils.moveToDirectory(getFile(f).toFile(), targetPath.toFile(), false);
        }
    }

    public void newFile(String path, FileType type, String name) throws IOException {
        Path dir = getFile(path);

        if (FileType.DIR == type) {
            Files.createDirectory(dir.resolve(name));
        } else {
            Files.createFile(dir.resolve(name));
        }
    }

    public void renameFile(String path, String changeName) throws IOException {
        Path srcPath = getFile(path);
        Files.move(srcPath, srcPath.getParent().resolve(changeName));
    }

    public void deleteFiles(List<String> files) throws IOException {

        Path trashPath = getTrashPath();
        Files.createDirectories(trashPath);
        Path trashTempPath = Files.createTempDirectory(trashPath, "");

        for (String f : files) {
            FileUtils.moveToDirectory(getFile(f).toFile(), trashTempPath.toFile(), false);
        }
    }

    public File exportFiles(List<String> files) throws IOException {

        List<Path> allFiles = new ArrayList<>();
        for (String path : files) {
            Path file = getFile(path);
            if (Files.isDirectory(file)) {
                allFiles.addAll(Files.walk(file).toList());
            } else {
                allFiles.add(file);
            }
        }

        List<FileDto> fileList = allFiles.stream().map(path -> fileBrowserService.toFileDto(path)).toList();

        try (final SimpleExcelExporter simpleExcelExporter = new SimpleExcelExporter();) {

            final List<String> headers = Arrays.asList("type", "name", "path", "owner", "size", "lastModifiedTime");

            List<SimpleCell[]> rows = fileList.stream()
                    .map(file -> simpleExcelExporter.toSimpleCell(
                            new Object[] { file.getType(), file.getName(), file.getPath(), file.getOwner(),
                                    file.getSize(),
                                    file.getLastModifiedTime() }))
                    .toList();

            simpleExcelExporter.writeHead(headers.toArray(new String[0]));
            simpleExcelExporter.writeData(rows);

            for (int i = 0; i < headers.size(); i++) {
                simpleExcelExporter.getExcelWriter().autoSizeColumn(i);
            }

            return simpleExcelExporter.export();
        }
    }

    public FileDownloadDto downloadFiles(List<String> files) throws IOException {

        List<Path> fileList = getFiles(files);

        if (fileList.size() == 1 && Files.isRegularFile(fileList.get(0))) {
            File downloadFile = fileList.get(0).toFile();
            return FileDownloadDto.builder().fileName(downloadFile.getName()).file(downloadFile).build();

        } else {
            File downloadFile = compressFiles(fileList);
            return FileDownloadDto.builder().fileName("files.zip").file(downloadFile).build();
        }
    }

    public File compressFiles(List<Path> files) throws IOException {

        Path zipFilePath = Files.createTempFile(Paths.get(trashPath), "zip_", ".zip");

        try (FileOutputStream fos = new FileOutputStream(zipFilePath.toFile());
                ZipOutputStream zos = new ZipOutputStream(fos);) {

            for (Path sourceFile : files) {

                if (!Files.exists(sourceFile)) {
                    continue;
                }

                if (Files.isDirectory(sourceFile)) {
                    List<Path> dirFiles = Files.walk(sourceFile).filter(subDirFile -> Files.isRegularFile(subDirFile))
                            .toList();

                    for (Path dirFile : dirFiles) {
                        String zipEntryName = sourceFile.getParent().relativize(dirFile).toString();
                        writeToZos(dirFile.toFile(), zipEntryName, zos);
                    }

                } else if (Files.isRegularFile(sourceFile)) {
                    writeToZos(sourceFile.toFile(), sourceFile.toFile().getName(), zos);
                }
            }

        }

        return zipFilePath.toFile();
    }

    private void writeToZos(File file, String zipEntryName, ZipOutputStream zos) throws IOException {
        // ZIP 항목을 추가
        ZipEntry zipEntry = new ZipEntry(zipEntryName);
        zos.putNextEntry(zipEntry);

        // 파일을 읽어 압축 스트림에 쓰기
        byte[] buffer = new byte[1024];
        try (FileInputStream fis = new FileInputStream(file)) {
            int length;
            while ((length = fis.read(buffer)) > 0) {
                zos.write(buffer, 0, length);
            }
        }

        zos.closeEntry(); // ZIP 항목 닫기
    }
}
