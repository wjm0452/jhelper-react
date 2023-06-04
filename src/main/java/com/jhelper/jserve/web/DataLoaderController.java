package com.jhelper.jserve.web;

import com.jhelper.jserve.web.sql.SqlHelperService;
import com.jhelper.jserve.web.sql.SqlResult;
import com.jhelper.jserve.web.sql.dataloader.DataLoaderService;
import com.jhelper.jserve.web.sql.dataloader.model.DataLoaderVO;
import com.jhelper.jserve.web.sql.export.SqlExcelExportService;
import com.jhelper.jserve.web.sql.export.SqlTextExportService;
import com.jhelper.jserve.web.sql.model.QueryVO;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

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
@RequestMapping("/api/dataloader")
public class DataLoaderController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    DataLoaderService dataLoaderService;

    @PostMapping
    public void dataloader(@RequestBody DataLoaderVO dataLoaderVO) throws IOException {
        dataLoaderService.load(dataLoaderVO);
    }
}
