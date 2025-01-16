package com.jhelper.jserve.web;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jhelper.jserve.web.document.Doc2HtmlConverter;
import com.jhelper.jserve.web.fileCommand.FileCommandService;

@RestController
@RequestMapping("/api/file-viewer")
public class FileViewerController {

    @Autowired
    private FileCommandService fileCommandService;

    @GetMapping("/video")
    public ResponseEntity<byte[]> getVideo(@RequestParam String path,
            @RequestHeader(value = HttpHeaders.RANGE, required = false) String range) throws IOException {
        Path file = fileCommandService.getFile(path);

        long fileSize = Files.size(file);
        if (range != null) {
            // 클라이언트에서 요청한 범위를 처리
            List<HttpRange> ranges = HttpRange.parseRanges(range);
            HttpRange httpRange = ranges.get(0); // 단일 범위만 처리
            long start = httpRange.getRangeStart(fileSize);
            long end = Math.min(httpRange.getRangeEnd(fileSize), start + 10000000L);
            long contentLength = end - start + 1;

            try (RandomAccessFile raf = new RandomAccessFile(file.toFile(), "r")) {
                raf.seek(start);
                byte[] content = new byte[(int) contentLength];
                raf.read(content);

                return ResponseEntity.status(206) // Partial Content
                        .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + fileSize)
                        .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength))
                        .body(content);
            }

        } else {
            // 범위가 없으면 전체 파일을 스트리밍
            try (FileInputStream fis = new FileInputStream(file.toFile())) {
                byte[] content = new byte[(int) fileSize];
                fis.read(content);

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(fileSize))
                        .body(content);
            }
        }
    }

    @GetMapping("/image")
    public ResponseEntity<Resource> image(@RequestParam String path,
            @RequestHeader(value = "Accept-Charset", defaultValue = "UTF-8") String acceptCharset) throws IOException {
        Path file = fileCommandService.getFile(path);
        return getFile(path, acceptCharset, Files.probeContentType(file));
    }

    @GetMapping("/pdf")
    public ResponseEntity<Resource> pdf(@RequestParam String path,
            @RequestHeader(value = "Accept-Charset", defaultValue = "UTF-8") String acceptCharset) throws IOException {
        return getFile(path, acceptCharset, MediaType.APPLICATION_PDF_VALUE);
    }

    @GetMapping("/text")
    public ResponseEntity<Resource> text(@RequestParam String path,
            @RequestHeader(value = "Accept-Charset", defaultValue = "UTF-8") String acceptCharset) throws IOException {
        return getFile(path, acceptCharset, MediaType.TEXT_PLAIN_VALUE);
    }

    @GetMapping("/file")
    public ResponseEntity<Resource> file(@RequestParam String path,
            @RequestHeader(value = "Accept-Charset", defaultValue = "UTF-8") String acceptCharset) throws IOException {
        Path file = fileCommandService.getFile(path);
        return getFile(path, acceptCharset, Files.probeContentType(file));
    }

    private ResponseEntity<Resource> getFile(String path, String acceptCharset, String contentType) throws IOException {
        Path file = fileCommandService.getFile(path);
        return getFile(file, acceptCharset, contentType);
    }

    private ResponseEntity<Resource> getFile(Path file, String acceptCharset, String contentType) throws IOException {
        Resource resource = new InputStreamResource(new FileInputStream(file.toFile()));
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, contentType);
        headers.setContentDisposition(ContentDisposition.inline()
                .filename(file.getFileName().toString(), Charset.forName(acceptCharset)).build());
        headers.setContentLength(file.toFile().length());

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }

    @GetMapping("/docx")
    public ResponseEntity<Resource> docx(@RequestParam String path,
            @RequestHeader(value = "Accept-Charset", defaultValue = "UTF-8") String acceptCharset) throws IOException {
        Path file = fileCommandService.getFile(path);
        Path outputFile = fileCommandService.createTempFile(file.getFileName().toString(), ".html");

        Doc2HtmlConverter.docxToHtml(file.toFile(), outputFile.toFile());

        return getFile(outputFile, acceptCharset, Files.probeContentType(outputFile));
    }

    @GetMapping("/pptx")
    public ResponseEntity<Resource> pptx(@RequestParam String path,
            @RequestHeader(value = "Accept-Charset", defaultValue = "UTF-8") String acceptCharset) throws IOException {
        Path file = fileCommandService.getFile(path);
        Path outputFile = fileCommandService.createTempFile(file.getFileName().toString(), ".html");

        Doc2HtmlConverter.pptxToHtml(file.toFile(), outputFile.toFile());

        return getFile(outputFile, acceptCharset, Files.probeContentType(outputFile));
    }
}
