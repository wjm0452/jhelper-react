package com.jhelper.jserve.common;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PageDto<T> {
    private long totalElements;
    private int size;
    private int page;
    private int numberOfElements;
    private List<T> items;
}
