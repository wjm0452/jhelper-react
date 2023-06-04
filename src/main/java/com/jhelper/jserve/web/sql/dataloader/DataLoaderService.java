package com.jhelper.jserve.web.sql.dataloader;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.web.sql.dataloader.model.DataLoaderVO;
import com.jhelper.jserve.web.sql.dataloader.model.SourceInfoVO;
import com.jhelper.jserve.web.sql.dataloader.model.TargetInfoVO;
import com.jhelper.jserve.web.sql.jdbc.JdbcTemplateManager;

@Service
public class DataLoaderService {

    @Autowired
    JdbcTemplateManager jdbcManager;

    public void load(DataLoaderVO dataLoaderVO) {
        SourceInfoVO source = dataLoaderVO.getSource();
        TargetInfoVO target = dataLoaderVO.getTarget();

        String query = source.getQuery();
        JdbcTemplate sourceJdbc = jdbcManager.getJdbcTemplateById(source.getName());

        Loader loader = new Loader(target);

        sourceJdbc.query(query, new RowCallbackHandler() {
            @Override
            public void processRow(ResultSet rs) throws SQLException {
                loader.load(rs);
            }
        });
    }

    class Loader {

        TargetInfoVO target;

        public Loader(TargetInfoVO target) {
            this.target = target;

        }

        public void load(ResultSet rs) throws SQLException {
            final JdbcTemplate jdbcTemplate = jdbcManager.getJdbcTemplateById(target.getName());
            final String statement = getStatement();

            int columnsLength = target.getColumns().length;
            int count = 0;
            List<Object[]> paramsTemp = new ArrayList<>();

            while (rs.next()) {

                Object[] params = new Object[columnsLength];

                for (int i = 0; i < columnsLength; i++) {
                    params[i] = rs.getObject(i);
                }

                paramsTemp.add(params);

                count++;

                if (count >= 100) {
                    jdbcTemplate.batchUpdate(statement, paramsTemp);
                    paramsTemp.clear();
                    count = 0;
                }
            }

            if (count > 0) {
                jdbcTemplate.batchUpdate(statement, paramsTemp);
                paramsTemp.clear();
                count = 0;
            }

        }

        public String getStatement() {
            String owner = target.getOwner();
            String tableName = target.getTableName();
            String[] columns = target.getColumns();

            String[] params = new String[columns.length];
            Arrays.fill(params, 0, params.length, "?");

            String statement = String.format("insert into %s.%s(%s) values(%s)",
                    owner,
                    tableName,
                    String.join(", ", columns),
                    String.join(", ", params));

            return statement;
        }
    }
}
