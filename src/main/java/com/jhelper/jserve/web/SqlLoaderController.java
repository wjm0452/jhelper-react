package com.jhelper.jserve.web;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jhelper.jserve.sql.dataloader.SqlLoaderService;
import com.jhelper.jserve.sql.dataloader.SqlLoaderVO;

@RestController
@RequestMapping("/api/dataloader/sql")
public class SqlLoaderController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    SqlLoaderService sqlLoaderService;

    @PostMapping
    public void sqlloader(@RequestBody SqlLoaderVO sqlLoaderVO) throws IOException {
        sqlLoaderService.load(sqlLoaderVO);
    }
}
