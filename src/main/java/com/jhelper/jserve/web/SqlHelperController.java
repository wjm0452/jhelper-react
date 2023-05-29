package com.jhelper.jserve.web;

import com.jhelper.jserve.web.sql.SqlHelperService;
import com.jhelper.jserve.web.sql.SqlResult;
import com.jhelper.jserve.web.sql.model.QueryVO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping
    public SqlResult query(@RequestBody QueryVO queryVo) {
        return sqlHelperService.select(queryVo);
    }
}
