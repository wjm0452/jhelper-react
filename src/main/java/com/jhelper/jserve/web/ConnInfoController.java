package com.jhelper.jserve.web;

import java.util.List;

import com.jhelper.jserve.sql.ConnInfoService;
import com.jhelper.jserve.sql.entity.ConnInfo;
import com.jhelper.jserve.sql.jdbc.JdbcTemplateManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/conn-info")
public class ConnInfoController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    ConnInfoService connInfoService;

    @Autowired
    JdbcTemplateManager jdbcTemplateManager;

    @GetMapping
    public List<ConnInfo> getAll() {
        return connInfoService.findAll();
    }

    @GetMapping("/{id}")
    public ConnInfo get(@PathVariable String id) {
        return connInfoService.findById(id);
    }

    @PutMapping
    public ConnInfo save(@RequestBody ConnInfo connInfo) {
        jdbcTemplateManager.removeJdbcTemplate(connInfo.getName());
        return connInfoService.save(connInfo);
    }

    @DeleteMapping("/{id}")
    public void deleteCache(@PathVariable String id) {
        jdbcTemplateManager.removeJdbcTemplate(id);
        connInfoService.delete(id);
    }
}
