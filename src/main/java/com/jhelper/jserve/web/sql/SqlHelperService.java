package com.jhelper.jserve.web.sql;

import com.jhelper.jserve.web.sql.jdbc.JdbcTemplateManager;
import com.jhelper.jserve.web.sql.model.QueryVO;

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

@Service
public class SqlHelperService {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    JdbcTemplateManager jdbcManager;

    public SqlResult select(QueryVO queryVo) {

        SqlResultHandler sqlResultHandler = new SqlResultHandler();

        select(queryVo, sqlResultHandler);
        return sqlResultHandler.getResult();
    }

    public SqlResult select(String dbName, String query, Object[] params) {

        SqlResultHandler sqlResultHandler = new SqlResultHandler();

        select(dbName, query, params, sqlResultHandler);
        return sqlResultHandler.getResult();
    }

    public void select(QueryVO queryVo, ResultSetHandler resultHandler) {

        String query = queryVo.getQuery();
        int offset = queryVo.getOffset();
        int limit = queryVo.getLimit();

        query = query.trim();
        if (query.endsWith(";")) {
            query = query.substring(0, query.lastIndexOf(";"));
        }

        if (query.toLowerCase().startsWith("select")) {
            query = String.format("select * from (%s) offset %d rows fetch next %d rows only", query, offset, limit);
        }

        select(queryVo.getName(), query, queryVo.getParams(), resultHandler);
    }

    public void select(String dbName, String query, Object[] params, ResultSetHandler resultHandler) {

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

        SqlResult sqlResult = new SqlResult();

        @Override
        public void process(ResultSet rs) throws SQLException {
            ResultSetWrappingSqlRowSet sqlRowSet = new ResultSetWrappingSqlRowSet(rs);
            SqlRowSetMetaData sqlRowSetMetaData = sqlRowSet.getMetaData();

            final String[] columnNames = sqlRowSetMetaData.getColumnNames();
            final int columnSize = columnNames.length;

            List<Object[]> resultList = new ArrayList<>();

            while (sqlRowSet.next()) {

                Object[] columns = new Object[columnSize];

                for (int i = 0; i < columnSize; i++) {
                    columns[i] = sqlRowSet.getString(i + 1);
                }

                resultList.add(columns);
            }

            sqlResult.setColumnNames(columnNames);
            sqlResult.setResult(resultList.toArray(new Object[0][]));
        }

        public SqlResult getResult() {
            return sqlResult;
        }
    }

}
