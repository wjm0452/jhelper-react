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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.ResultSetWrappingSqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.sql.QueryDto;
import com.jhelper.jserve.sql.ResultSetHandler;
import com.jhelper.jserve.sql.SqlExportService;
import com.jhelper.jserve.sql.SqlHelperService;

@Service
public class SqlTextExportService implements SqlExportService {

    @Autowired
    SqlHelperService sqlHelperService;

    public File export(QueryDto queryDto) throws IOException {

        String tmpDir = System.getProperty("java.io.tmpdir");

        Path tmpFile = Files.createTempFile(Paths.get(tmpDir), "", "");

        try (final BufferedWriter bw = Files.newBufferedWriter(tmpFile, Charset.forName("utf-8"))) {

            sqlHelperService.select(queryDto, new ResultSetHandler() {

                @Override
                public void process(ResultSet rs) throws SQLException {

                    try {
                        ResultSetWrappingSqlRowSet sqlRowSet = new ResultSetWrappingSqlRowSet(rs);
                        SqlRowSetMetaData sqlRowSetMetaData = sqlRowSet.getMetaData();

                        final String[] columnNames = sqlRowSetMetaData.getColumnNames();
                        final int columnSize = columnNames.length;

                        String result = String.join("\t", columnNames);
                        bw.write(result);
                        bw.newLine();

                        while (sqlRowSet.next()) {

                            Object[] columns = new Object[columnSize];

                            for (int i = 0; i < columnSize; i++) {
                                columns[i] = sqlRowSet.getString(i + 1);
                            }

                            String line = Arrays.stream(columns)
                                    .map(value -> value == null ? null : String.valueOf(value))
                                    .collect(Collectors.joining("\t"));

                            bw.write(line);
                            bw.newLine();
                        }

                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }

            });

        }

        return tmpFile.toFile();
    }
}
