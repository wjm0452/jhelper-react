package com.jhelper.jserve.sql;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.sql.entity.SqlHistory;

@Service
public class SqllHistoryService {

    @Autowired
    private SqlHistoryRepository sqlHistoryRepository;

    public List<SqlHistory> findRecently() {
        return sqlHistoryRepository.findAll(Sort.by("registerDate").descending()).stream().limit(20).toList();
    }
}
