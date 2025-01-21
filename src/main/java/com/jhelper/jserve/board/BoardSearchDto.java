package com.jhelper.jserve.board;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class BoardSearchDto {
    private LocalDateTime from;
    private LocalDateTime to;
    private String registerId;
    private String filter;
}
