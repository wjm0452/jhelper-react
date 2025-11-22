package com.jhelper.jserve.sql.export;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.stream.Collectors;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.ResultSetWrappingSqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.sql.QueryDto;
import com.jhelper.jserve.sql.ResultSetHandler;
import com.jhelper.jserve.sql.SqlExportService;
import com.jhelper.jserve.sql.SqlHelperService;

@Service
public class SqlCsvExportService implements SqlExportService {

    @Autowired
    SqlHelperService sqlHelperService;

    public File export(QueryDto queryDto) throws IOException {

        String tmpDir = System.getProperty("java.io.tmpdir");

        Path tmpFile = Files.createTempFile(Paths.get(tmpDir), "", "");

        try (final BufferedWriter bw = Files.newBufferedWriter(tmpFile, Charset.forName("utf-8"));
                CSVPrinter csvPrinter = new CSVPrinter(bw, CSVFormat.EXCEL);) {

            sqlHelperService.select(queryDto, new ResultSetHandler() {

                @Override
                public void process(ResultSet rs) throws SQLException {
                    try {
                        csvPrinter.printHeaders(rs);
                        csvPrinter.printRecords(rs);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }

            });

        }

        return tmpFile.toFile();
    }
}
