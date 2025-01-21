package com.jhelper.jserve.sql;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.support.rowset.ResultSetWrappingSqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.sql.jdbc.JdbcTemplateManager;

@Service
public class SqlHelperService {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    JdbcTemplateManager jdbcManager;

    public SqlResultDto execute(QueryDto queryDto) {
        if (queryDto.getQuery().trim().toLowerCase().startsWith("select")) {
            return this.select(queryDto);
        } else {
            return this.update(queryDto);
        }
    }

    public SqlResultDto update(QueryDto queryDto) {

        String dbName = queryDto.getName();
        String query = queryDto.getQuery();
        Object[] params = queryDto.getParams();

        JdbcTemplate jdbcTemplate = jdbcManager.getJdbcTemplateById(dbName);

        if (jdbcTemplate == null) {
            throw new RuntimeException("Jdbc not found");
        }

        logger.debug("query: {}", query);
        int count = jdbcTemplate.update(query, params);

        SqlResultDto sqlResult = new SqlResultDto();
        sqlResult.setCount(count);

        return sqlResult;
    }

    public SqlResultDto select(QueryDto queryDto) {

        SqlResultHandler sqlResultHandler = new SqlResultHandler(queryDto.getFetchSize());

        select(queryDto, sqlResultHandler);
        return sqlResultHandler.getResult();
    }

    public void select(QueryDto queryDto, ResultSetHandler resultHandler) {

        String dbName = queryDto.getName();
        String query = queryDto.getQuery();
        Object[] params = queryDto.getParams();

        JdbcTemplate jdbcTemplate = jdbcManager.getJdbcTemplateById(dbName);

        if (jdbcTemplate == null) {
            throw new RuntimeException("Jdbc not found");
        }

        logger.debug("query: {}", query);
        jdbcTemplate.query(query, new ResultSetExtractor<Object>() {
            @Override
            public Object extractData(ResultSet rs) throws SQLException, DataAccessException {
                resultHandler.process(rs);
                return null;
            }
        }, params);
    }

    class SqlResultHandler implements ResultSetHandler {

        SqlResultDto sqlResult = new SqlResultDto();
        int fetchSize = 0;

        public SqlResultHandler(int fetchSize) {
            this.fetchSize = fetchSize;
        }

        @Override
        public void process(ResultSet rs) throws SQLException {
            ResultSetWrappingSqlRowSet sqlRowSet = new ResultSetWrappingSqlRowSet(rs);
            SqlRowSetMetaData sqlRowSetMetaData = sqlRowSet.getMetaData();

            final String[] columnNames = sqlRowSetMetaData.getColumnNames();
            final int columnSize = columnNames.length;

            List<Object[]> resultList = new ArrayList<>();

            int rowCount = -1;
            boolean hasNext = false;

            while ((fetchSize == -1 || ++rowCount <= fetchSize) && sqlRowSet.next()) {

                if (fetchSize == -1 || rowCount < fetchSize) {

                    Object[] columns = new Object[columnSize];

                    for (int i = 0; i < columnSize; i++) {
                        columns[i] = sqlRowSet.getString(i + 1);
                    }

                    resultList.add(columns);
                } else {
                    hasNext = true;
                }
            }

            sqlResult.setHasNext(hasNext);
            sqlResult.setColumnNames(columnNames);
            sqlResult.setResult(resultList.toArray(new Object[0][]));
            sqlResult.setCount(resultList.size());
        }

        public SqlResultDto getResult() {
            return sqlResult;
        }
    }

}
