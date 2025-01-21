package com.jhelper.jserve.web;

import com.jhelper.jserve.sql.QueryDto;
import com.jhelper.jserve.sql.SqlErrorDto;
import com.jhelper.jserve.sql.SqlHelperService;
import com.jhelper.jserve.sql.SqlResultDto;
import com.microsoft.sqlserver.jdbc.SQLServerException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sql")
public class SqlHelperController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    SqlHelperService sqlHelperService;

    @ExceptionHandler(SQLServerException.class)
    public ResponseEntity<SqlErrorDto> sqlServerError(SQLServerException e) {

        SqlErrorDto sqlError = new SqlErrorDto();

        sqlError.setSqlState(e.getSQLState());
        sqlError.setErrorMessage(e.getSQLServerError().getErrorMessage());

        return ResponseEntity
                .badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(sqlError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<SqlErrorDto> runtimeError(Exception e) {

        SqlErrorDto sqlError = new SqlErrorDto();

        sqlError.setSqlState("RUN");
        sqlError.setErrorMessage(e.getMessage());

        return ResponseEntity
                .badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(sqlError);
    }

    @PostMapping
    public SqlResultDto query(@RequestBody QueryDto queryDto) throws SQLServerException {
        try {
            return sqlHelperService.execute(queryDto);
        } catch (DataAccessException e) {
            Throwable cause = e.getCause();

            if (cause instanceof SQLServerException) {
                SQLServerException sqlServerException = ((SQLServerException) cause);
                throw sqlServerException;
            }

            throw e;
        }
    }
}
