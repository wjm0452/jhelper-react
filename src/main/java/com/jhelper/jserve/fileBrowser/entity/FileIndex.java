package com.jhelper.jserve.fileBrowser.entity;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.apache.commons.io.FilenameUtils;
import org.hibernate.annotations.Comment;
import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.DocumentId;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity(name = "fileIndex")
@Comment(value = "파일정보")
@Indexed
public class FileIndex {

    @Id
    @Column(name = "path")
    @Comment(value = "파일경로")
    @KeywordField(sortable = Sortable.YES)
    @DocumentId
    private String path;

    @Column(name = "parent_path")
    @Comment(value = "상위경로")
    @KeywordField(sortable = Sortable.YES)
    private String parentPath;

    @Column(name = "name")
    @Comment(value = "파일명")
    @FullTextField
    @GenericField(name = "name_sort", sortable = Sortable.YES)
    private String name;

    @Column(name = "owner")
    @Comment(value = "Owner")
    @KeywordField(sortable = Sortable.YES)
    private String owner;

    @Column(name = "size")
    @Comment(value = "Size")
    @GenericField(sortable = Sortable.YES)
    private long size;

    @Column(name = "last_modified_time")
    @Comment(value = "최종수정일")
    @GenericField(sortable = Sortable.YES)
    private LocalDateTime lastModifiedTime;

    @Column(name = "directory")
    @Comment(value = "디렉토리여부")
    @GenericField(sortable = Sortable.YES)
    private boolean directory;

    @Column(name = "hidden")
    @Comment(value = "숨김파일여부")
    @GenericField(sortable = Sortable.YES)
    private boolean hidden;

    public static FileIndex of(Path path) {
        File file = path.normalize().toFile();
        FileIndex doc = new FileIndex();
        doc.setName(file.getName());
        doc.setPath(FilenameUtils.normalize(file.getAbsolutePath()));
        doc.setParentPath(file.getParent());
        doc.setSize(file.length());
        doc.setDirectory(file.isDirectory());
        doc.setHidden(file.isHidden());

        Instant instant = Instant.ofEpochMilli(file.lastModified());
        doc.setLastModifiedTime(instant.atZone(ZoneId.systemDefault()).toLocalDateTime());

        try {
            doc.setOwner(Files.getOwner(path).getName());
        } catch (IOException e) {
        }

        return doc;
    }
}
