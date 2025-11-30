package com.jhelper.jserve.web;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jhelper.jserve.sql.SqllHistoryService;
import com.jhelper.jserve.sql.entity.SqlHistory;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/sql-history")
public class SqlHistoryController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private SqllHistoryService sqlHistoryService;

    @GetMapping
    public List<SqlHistory> findRecently() {
        return sqlHistoryService.findRecently();
    }
}
