package com.jhelper.jserve.web;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jhelper.jserve.sql.TableBookmarkService;
import com.jhelper.jserve.sql.entity.TableBookmark;

@RestController
@RequestMapping("/api/table-bookmark")
public class TableBookmarkController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private TableBookmarkService tableBookmarkService;

    @GetMapping
    public List<TableBookmark> getBookmarks(@RequestParam(name = "name") String name,
            @RequestParam(name = "owner") String owner,
            @RequestParam(name = "tableName", required = false) String tableName) {
        TableBookmark tableBookmark = new TableBookmark();
        tableBookmark.setName(name);
        tableBookmark.setOwner(owner);
        tableBookmark.setTableName(tableName);
        return tableBookmarkService.findAllBy(tableBookmark);
    }

    @PostMapping
    public TableBookmark saveBookmark(@RequestBody TableBookmark tableBookmark) {
        return tableBookmarkService.save(tableBookmark);
    }

    @DeleteMapping
    public void deleteBookmark(@RequestParam(name = "name") String name,
            @RequestParam(name = "owner") String owner,
            @RequestParam(name = "tableName") String tableName) {
        TableBookmark.PK tableBookmarkPk = new TableBookmark.PK();
        tableBookmarkPk.setName(name);
        tableBookmarkPk.setOwner(owner);
        tableBookmarkPk.setTableName(tableName);
        tableBookmarkService.delete(tableBookmarkPk);
    }
}
