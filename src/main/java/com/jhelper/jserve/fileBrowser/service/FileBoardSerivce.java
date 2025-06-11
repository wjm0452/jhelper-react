package com.jhelper.jserve.fileBrowser.service;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.AccessDeniedException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;

import com.jhelper.jserve.board.BoardService;
import com.jhelper.jserve.board.entity.Board;
import com.jhelper.jserve.common.Doc2TextConverter;
import com.jhelper.jserve.fileBrowser.FileBoardResultDto;
import com.jhelper.jserve.fileBrowser.entity.FileBoard;
import com.jhelper.jserve.fileBrowser.properties.FileBrowserBoardProperties;
import com.jhelper.jserve.fileBrowser.repository.FileBoardRepository;

@Service
public class FileBoardSerivce {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private BoardService boardService;

    @Autowired
    private FileBrowserService fileBrowserService;

    @Autowired
    private FileBrowserBoardProperties fileBrowserBoardProperties;

    @Autowired
    private FileBoardRepository fileBoardRepository;

    private AntPathMatcher pathMatcher = new AntPathMatcher();

    private boolean isExclusions(Path path) {
        List<String> exclusions = fileBrowserBoardProperties.getExclusions();
        String fileName = path.getFileName().toString();

        return exclusions.stream().anyMatch(e -> pathMatcher.match(e, fileName));
    }

    public Path getFile(String path) throws AccessDeniedException {
        return fileBrowserService.getFile(path);
    }

    public List<Path> getFiles(List<String> paths) throws IOException {
        return fileBrowserService.getFiles(paths);
    }

    public List<Path> walkFiles(String path) throws IOException {
        return walkFiles(Arrays.asList(path));
    }

    public List<Path> walkFiles(List<String> paths) throws IOException {
        List<Path> pathResults = new ArrayList<>();
        for (String filePath : paths) {

            Path file = getFile(filePath);

            if (Files.isDirectory(file)) {
                Files.walkFileTree(file, new SimpleFileVisitor<Path>() {
                    @Override
                    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                        if (dir.getFileName().toString().startsWith(".")) {
                            return FileVisitResult.SKIP_SUBTREE;
                        }

                        return FileVisitResult.CONTINUE;
                    }

                    @Override
                    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                        if (Files.isRegularFile(file) && !isExclusions(file)) {
                            pathResults.add(file);
                        }

                        return FileVisitResult.CONTINUE;
                    }
                });
            } else {
                pathResults.add(file);
            }
        }

        return pathResults;
    }

    public List<FileBoardResultDto> save(List<String> paths) throws IOException {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Path> fileList = getFiles(paths);

        List<FileBoardResultDto> saveResults = new ArrayList<>();

        for (Path file : fileList) {

            if (!Files.isRegularFile(file)) {
                continue;
            }

            FileBoardResultDto resultDto = new FileBoardResultDto();
            resultDto.setFile(file.toAbsolutePath().toString());
            resultDto.setSaved(false);
            resultDto.setError(false);

            try {

                String content = fileToString(file);
                if (content == null) {
                    continue;
                }

                String filePath = file.toAbsolutePath().toString();
                FileBoard fileBoard = fileBoardRepository.findByFilePath(filePath);
                try {
                    if (fileBoard == null) {
                        Board board = new Board();
                        board.setCategory("file");
                        board.setTitle(filePath);
                        board.setContent(content);
                        board.setRegisterId(userDetails.getUsername());
                        board.setRegisterDate(LocalDateTime.now());

                        board = boardService.create(board);

                        fileBoard = new FileBoard();
                        fileBoard.setBoardId(board.getId());
                        fileBoard.setFilePath(filePath);
                        fileBoard.setRegisterDate(LocalDateTime.now());
                        fileBoard.setBoard(board);

                        fileBoardRepository.save(fileBoard);

                    } else {

                        Board board = fileBoard.getBoard();
                        board.setContent(content);

                        board = boardService.update(board);

                        fileBoardRepository.save(fileBoard);

                    }
                } catch (Exception e) {
                    resultDto.setError(true);
                    resultDto.setErrorMessage(e.getMessage());
                    continue;
                }

                resultDto.setSaved(true);
                resultDto.setMessage("saved success");

            } catch (IOException e) {
                resultDto.setError(true);
                resultDto.setErrorMessage(e.getMessage());
            }

            saveResults.add(resultDto);
        }

        return saveResults;
    }

    private String fileToString(Path path) throws IOException {
        String extension = FilenameUtils.getExtension(path.getFileName().toString()).toLowerCase();

        if ("pptx".equalsIgnoreCase(extension)) {
            return Doc2TextConverter.pptxToText(path.toFile());
        } else if ("docx".equalsIgnoreCase(extension)) {
            return Doc2TextConverter.docxToText(path.toFile());
        } else if ("xlsx".equalsIgnoreCase(extension)) {
            return Doc2TextConverter.xlsxToText(path.toFile());
        } else if ("pdf".equalsIgnoreCase(extension)) {
            return Doc2TextConverter.pdfToText(path.toFile());
        } else {

            String content = FileUtils.readFileToString(path.toFile(), Charset.forName("UTF-8"));

            if ("java".equalsIgnoreCase(extension)) {
                return String.format("```java\n%s\n```", content);
            } else if ("jsp".equalsIgnoreCase(extension)) {
                return String.format("```jsp\n%s\n```", content);
            } else if ("js".equalsIgnoreCase(extension) || "ts".equalsIgnoreCase(extension)) {
                return String.format("```js\n%s\n```", content);
            } else if ("html".equalsIgnoreCase(extension)) {
                return String.format("```html\n%s\n```", content);
            } else if ("css".equalsIgnoreCase(extension)) {
                return String.format("```css\n%s\n```", content);
            }

            return content;
        }
    }
}
