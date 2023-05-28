package com.jhelper.jserve.web;

import com.jhelper.jserve.web.entity.Sql;
import com.jhelper.jserve.web.sql.SqlExportService;
import com.jhelper.jserve.web.sql.SqlHelperService;
import com.jhelper.jserve.web.sql.model.QueryVO;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sql-export")
public class SqlExportController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    SqlHelperService sqlHelperService;

    @Autowired
    SqlExportService sqlExportService;

    @PostMapping
    public ResponseEntity<Resource> query(@RequestBody QueryVO queryVo) throws IOException {
        Sql sql = sqlHelperService.select(queryVo);
        File file = sqlExportService.export(sql);

        Resource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"sql_export.xlsx\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @PostMapping("/text")
    public ResponseEntity<String> downloadText(@RequestBody QueryVO queryVo) throws IOException {
        Sql sql = sqlHelperService.select(queryVo);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"sql_export.txt\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(sqlToString(sql));
    }

    private String sqlToString(Sql sql) {

        String result = String.join("\t", sql.getColumnNames());

        String[] rows = Arrays.stream(sql.getResult()).map(row -> {
            return String.join("\t", row);
        }).toArray(String[]::new);

        result += "\r\n" + String.join("\r\n", rows);

        return result;
    }
}
