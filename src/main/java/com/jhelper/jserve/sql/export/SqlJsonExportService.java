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
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.ResultSetWrappingSqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.jhelper.jserve.sql.QueryDto;
import com.jhelper.jserve.sql.ResultSetHandler;
import com.jhelper.jserve.sql.SqlExportService;
import com.jhelper.jserve.sql.SqlHelperService;

@Service
public class SqlJsonExportService implements SqlExportService {

    @Autowired
    SqlHelperService sqlHelperService;

    public File export(QueryDto queryDto) throws IOException {

        String tmpDir = System.getProperty("java.io.tmpdir");

        Path tmpFile = Files.createTempFile(Paths.get(tmpDir), "", "");

        try (final BufferedWriter bw = Files.newBufferedWriter(tmpFile, Charset.forName("utf-8"))) {
            bw.write("[");
            sqlHelperService.select(queryDto, new ResultSetHandler() {

                @Override
                public void process(ResultSet rs) throws SQLException {

                    try {
                        ResultSetWrappingSqlRowSet sqlRowSet = new ResultSetWrappingSqlRowSet(rs);
                        SqlRowSetMetaData sqlRowSetMetaData = sqlRowSet.getMetaData();

                        final String[] columnNames = sqlRowSetMetaData.getColumnNames();
                        final int columnSize = columnNames.length;
                        ObjectMapper objectMapper = new ObjectMapper();
                        ObjectWriter objectWriter = objectMapper.writerWithDefaultPrettyPrinter();

                        int rowCount = 0;
                        while (sqlRowSet.next()) {

                            Map<String, Object> rowMap = new HashMap<>();

                            for (int i = 0; i < columnSize; i++) {
                                String columnName = columnNames[i];
                                rowMap.put(columnName, sqlRowSet.getString(i + 1));
                            }

                            if (rowCount != 0) {
                                bw.write(",");
                                bw.newLine();
                            }

                            bw.write(objectWriter.writeValueAsString(rowMap));
                            rowCount++;
                        }

                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            });
            bw.write("]");
        }

        return tmpFile.toFile();
    }
}
