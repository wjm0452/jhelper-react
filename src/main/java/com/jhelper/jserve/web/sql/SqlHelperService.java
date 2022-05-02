package com.jhelper.jserve.web.sql;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.sql.DataSource;

import com.jhelper.jserve.web.entity.ConnInfo;
import com.jhelper.jserve.web.entity.Sql;
import com.jhelper.jserve.web.sql.model.QueryVO;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
import org.springframework.stereotype.Service;

@Aspect
@Service
public class SqlHelperService implements InitializingBean {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    ConnInfoService connInfoService;

    Map<String, JdbcTemplate> jdbcTemplates = new HashMap<>();

    @Override
    public void afterPropertiesSet() throws Exception {
        this.loadDataSource();
    }

    @After("execution(* com.jhelper.jserve.web.sql.ConnInfoService.save(..))")
    public void afterAppendConnInfo(JoinPoint joinPoint) {
        logger.info("append datasource");

        Object[] args = joinPoint.getArgs();

        ConnInfo connInfo = (ConnInfo) Arrays.stream(args).filter(arg -> arg instanceof ConnInfo).findFirst().get();

        JdbcTemplate jdbcTemplate = jdbcTemplates.get(connInfo.getName());

        if (jdbcTemplate != null) {
            jdbcTemplates.remove(connInfo.getName());
        }

        addJdbcTemplate(connInfo);
    }

    @After("execution(* com.jhelper.jserve.web.sql.ConnInfoService.delete(..))")
    public void afterDeleteConnInfo(JoinPoint joinPoint) {
        logger.info("append datasource");

        Object[] args = joinPoint.getArgs();

        String name = (String) Arrays.stream(args).filter(arg -> arg instanceof String).findFirst().get();

        JdbcTemplate jdbcTemplate = jdbcTemplates.get(name);

        if (jdbcTemplate != null) {
            jdbcTemplates.remove(name);
        }
    }

    public void loadDataSource() {
        List<ConnInfo> connInfos = connInfoService.findAll();
        connInfos.stream().forEach(connInfo -> addJdbcTemplate(connInfo));
    }

    public void addJdbcTemplate(ConnInfo connInfo) {
        synchronized (jdbcTemplates) {
            DataSource dataSource = DataSourceBuilder.create()
                    .url(connInfo.getJdbcUrl())
                    .driverClassName(connInfo.getDriverClassName())
                    .username(connInfo.getUsername())
                    .password(connInfo.getPassword())
                    .build();

            JdbcTemplate jdbcTmpl = new JdbcTemplate(dataSource);

            jdbcTemplates.put(connInfo.getName(), jdbcTmpl);
        }
    }

    public void removeJdbcTemplate(String id) {
        synchronized (jdbcTemplates) {
            jdbcTemplates.remove(id);
        }
    }

    public JdbcTemplate getJdbcTemplateById(String id) {
        return jdbcTemplates.get(id);
    }

    public Sql select(QueryVO queryVo) {

        String name = queryVo.getName();
        String query = queryVo.getQuery();
        String[] params = queryVo.getParams();

        JdbcTemplate jdbcTemplate = getJdbcTemplateById(name);

        if (jdbcTemplate == null) {
            throw new RuntimeException("Jdbc not found");
        }

        logger.debug("query: {}", query);

        query = query.trim();
        if (query.endsWith(";")) {
            query = query.substring(0, query.lastIndexOf(";"));
        }

        List<String[]> resultList = new ArrayList<String[]>();

        SqlRowSet sqlRowSet = jdbcTemplate.queryForRowSet(query, params);

        SqlRowSetMetaData sqlRowSetMetaData = sqlRowSet.getMetaData();

        final String[] columnNames = sqlRowSetMetaData.getColumnNames();
        final int columnSize = columnNames.length;

        while (sqlRowSet.next()) {

            String[] columns = new String[columnSize];

            for (int i = 0; i < columnSize; i++) {
                columns[i] = sqlRowSet.getString(i + 1);
            }

            resultList.add(columns);
        }

        Sql sqlVO = new Sql();
        sqlVO.setColumnNames(columnNames);
        sqlVO.setResult(resultList.toArray(new String[0][]));

        return sqlVO;
    }
}
