package com.jhelper.jserve.fileBrowser.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.Comment;

import com.jhelper.jserve.board.entity.Board;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import lombok.Data;

@Data
@Entity(name = "fileBoard")
@Comment(value = "파일게시판 매핑")
public class FileBoard {

    @Id
    @Column(name = "board_id")
    @Comment(value = "board_id")
    private Integer boardId;

    @Column(name = "file_path")
    @Comment(value = "파일경로")
    private String filePath;

    @Column(name = "register_date")
    @Comment(value = "등록일시")
    private LocalDateTime registerDate;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "boardId", referencedColumnName = "id")
    @OrderBy("id asc")
    private Board board;
}
