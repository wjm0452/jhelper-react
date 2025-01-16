package com.jhelper.jserve.web.sql;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.web.entity.TableBookmark;

@Service
public class TableBookmarkService {

    @Autowired
    private TableBookmarkRepository tableBookmarkRepository;

    public List<TableBookmark> findAllBy(TableBookmark tableBookmark) {

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnoreCase() // 대소문자 구분 없이 검색
                .withNullHandler(ExampleMatcher.NullHandler.IGNORE)
                .withStringMatcher(ExampleMatcher.StringMatcher.EXACT)
                .withMatcher("name",
                        ExampleMatcher.GenericPropertyMatcher.of(ExampleMatcher.StringMatcher.EXACT))
                .withMatcher("owner",
                        ExampleMatcher.GenericPropertyMatcher.of(ExampleMatcher.StringMatcher.EXACT))
                .withMatcher("tableName",
                        ExampleMatcher.GenericPropertyMatcher.of(ExampleMatcher.StringMatcher.CONTAINING));

        return tableBookmarkRepository.findAll(Example.of(tableBookmark, matcher));
    }

    public TableBookmark findById(TableBookmark.PK tableBookmarkPk) {
        return tableBookmarkRepository.findById(tableBookmarkPk).orElse(null);
    }

    public TableBookmark save(TableBookmark tableBookmark) {
        return tableBookmarkRepository.save(tableBookmark);
    }

    public void delete(TableBookmark.PK tableBookmarkPk) {
        tableBookmarkRepository.deleteById(tableBookmarkPk);
    }
}
