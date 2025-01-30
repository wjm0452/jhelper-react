package com.jhelper.jserve.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jhelper.jserve.fileBrowser.FileDto;
import com.jhelper.jserve.fileBrowser.FileSearchDto;
import com.jhelper.jserve.fileBrowser.service.FileBrowserService;

@RestController
@RequestMapping("/api/file-browser")
public class FileBrowserController {

    @Autowired
    private FileBrowserService fileSearchService;

    @GetMapping("/root-path")
    public FileDto getRootPath() throws IOException {
        return fileSearchService.toFileDto(fileSearchService.getRootPath());
    }

    @GetMapping("/files")
    public List<FileDto> getFileList(FileSearchDto fileSearchDto) throws IOException {
        return fileSearchService.searchFiles(fileSearchDto);
    }

    @GetMapping("/export")
    public ResponseEntity<Resource> exportSearchFiles(FileSearchDto fileSearchDto) throws IOException {
        File file = fileSearchService.export(fileSearchDto);

        Resource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"files.xlsx\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM).body(resource);
    }
}
