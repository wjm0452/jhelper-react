package com.jhelper.jserve.sql.export;

import java.io.File;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.ResultSetWrappingSqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
import org.springframework.stereotype.Service;

import com.jhelper.export.excel.SimpleExcelExporter;
import com.jhelper.jserve.sql.QueryDto;
import com.jhelper.jserve.sql.ResultSetHandler;
import com.jhelper.jserve.sql.SqlExportService;
import com.jhelper.jserve.sql.SqlHelperService;

@Service
public class SqlExcelExportService implements SqlExportService {

    @Autowired
    SqlHelperService sqlHelperService;

    public File export(QueryDto queryDto) throws IOException {

        try (final SimpleExcelExporter simpleExcelExporter = new SimpleExcelExporter();) {

            sqlHelperService.select(queryDto, new ResultSetHandler() {
                @Override
                public void process(ResultSet rs) throws SQLException {

                    ResultSetWrappingSqlRowSet sqlRowSet = new ResultSetWrappingSqlRowSet(rs);
                    SqlRowSetMetaData sqlRowSetMetaData = sqlRowSet.getMetaData();

                    final String[] columnNames = sqlRowSetMetaData.getColumnNames();
                    final int columnSize = columnNames.length;

                    simpleExcelExporter.writeHead(columnNames);

                    while (sqlRowSet.next()) {

                        Object[] columns = Arrays.stream(columnNames).map(name -> {
                            return sqlRowSet.getObject(name);
                        }).toArray();

                        simpleExcelExporter.writeData(simpleExcelExporter.toSimpleCell(columns));
                    }

                    for (int i = 0; i < columnSize; i++) {
                        simpleExcelExporter.getExcelWriter().autoSizeColumn(i);
                    }
                }
            });

            return simpleExcelExporter.export();
        }
    }
}
