package com.jhelper.jserve.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jhelper.jserve.fileBrowser.FileBoardResultDto;
import com.jhelper.jserve.fileBrowser.FileCommandDto;
import com.jhelper.jserve.fileBrowser.FileDownloadDto;
import com.jhelper.jserve.fileBrowser.FileDto;
import com.jhelper.jserve.fileBrowser.FileNewDto;
import com.jhelper.jserve.fileBrowser.FilePathsDto;
import com.jhelper.jserve.fileBrowser.FileRenameDto;
import com.jhelper.jserve.fileBrowser.FileType;
import com.jhelper.jserve.fileBrowser.service.FileBoardSerivce;
import com.jhelper.jserve.fileBrowser.service.FileBrowserService;
import com.jhelper.jserve.fileBrowser.service.FileCommandService;
import com.jhelper.jserve.fileBrowser.service.FileIndexService;

@RestController
@RequestMapping("/api/file-command")
public class FileCommandController {

    @Autowired
    private FileCommandService fileCommandService;

    @Autowired
    private FileBrowserService fileBrowserService;
    @Autowired
    private FileIndexService fileIndexService;

    @Autowired
    private FileBoardSerivce fileBoardSerivce;

    @PostMapping("/copy")
    public void copy(@RequestBody FileCommandDto fileCommandDto) throws IOException {
        fileCommandService.copyFiles(fileCommandDto.getFiles(), fileCommandDto.getPath());
    }

    @PostMapping("/move")
    public void move(@RequestBody FileCommandDto fileCommandDto) throws IOException {
        fileCommandService.moveFiles(fileCommandDto.getFiles(), fileCommandDto.getPath());
    }

    @PostMapping("/new")
    public void rename(@RequestBody FileNewDto fileNewDto) throws IOException {
        fileCommandService.newFile(fileNewDto.getPath(), FileType.valueOf(fileNewDto.getType()), fileNewDto.getName());
    }

    @PostMapping("/rename")
    public void rename(@RequestBody FileRenameDto fileRenameDto) throws IOException {
        fileCommandService.renameFile(fileRenameDto.getPath(), fileRenameDto.getChangeName());
    }

    @PostMapping("/delete")
    public void delete(@RequestBody FileCommandDto fileCommandDto) throws IOException {
        fileCommandService.deleteFiles(fileCommandDto.getFiles());
    }

    @PostMapping("/export")
    public ResponseEntity<Resource> export(@RequestBody FileCommandDto fileCommandDto) throws IOException {
        File file = fileCommandService.exportFiles(fileCommandDto.getFiles());

        Resource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"files.xlsx\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM).body(resource);
    }

    @PostMapping("/download")
    public ResponseEntity<Resource> download(@RequestBody FileCommandDto fileCommandDto,
            @RequestHeader(value = "Accept-Charset", defaultValue = "UTF-8") String acceptCharset) throws IOException {
        FileDownloadDto fileDownloadDto = fileCommandService.downloadFiles(fileCommandDto.getFiles());

        Resource resource = new InputStreamResource(new FileInputStream(fileDownloadDto.getFile()));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(fileDownloadDto.getFileName(), Charset.forName(acceptCharset)).build());
        headers.setContentLength(fileDownloadDto.getFile().length());

        return ResponseEntity.ok().headers(headers).body(resource);
    }

    @PostMapping("/upload")
    public FileDto upload(@RequestPart("file") MultipartFile multipartFile, @RequestParam(name = "path") String path)
            throws IOException {

        Path dir = fileBrowserService.getFile(path);
        Path saveFile = dir.resolve(multipartFile.getOriginalFilename());

        if (Files.exists(saveFile)) {
            throw new RuntimeException("Already existing file");
        }

        multipartFile.transferTo(saveFile);

        return fileBrowserService.toFileDto(saveFile);
    }

    @GetMapping("/file")
    public ResponseEntity<Resource> getFile(@RequestParam String path,
            @RequestHeader(value = "Accept-Charset", defaultValue = "UTF-8") String acceptCharset) throws IOException {
        Path file = fileCommandService.getFile(path);

        Resource resource = new InputStreamResource(new FileInputStream(file.toFile()));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(file.getFileName().toString(), Charset.forName(acceptCharset)).build());
        headers.setContentLength(file.toFile().length());

        return ResponseEntity.ok().headers(headers).body(resource);
    }

    @PostMapping("/board")
    public List<FileBoardResultDto> saveBoard(@RequestBody FilePathsDto filePathsDto) throws IOException {
        return fileBoardSerivce.save(filePathsDto.getFiles());
    }
}
