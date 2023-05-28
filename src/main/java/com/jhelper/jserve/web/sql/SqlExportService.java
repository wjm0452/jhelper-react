package com.jhelper.jserve.web.sql;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jhelper.export.excel.SimpleExcelExporter;
import com.jhelper.jserve.web.entity.Sql;

@Service
public class SqlExportService {

    @Autowired
    SimpleExcelExporter simpleExcelExporter;

    public File export(Sql sql) throws IOException {

        List<Object[]> lines = Arrays.stream(sql.getResult()).collect(Collectors.toList());

        return simpleExcelExporter.exportWithMap(sql.getColumnNames(), lines);
    }
}
