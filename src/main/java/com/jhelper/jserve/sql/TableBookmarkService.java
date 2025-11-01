package com.jhelper.jserve.sql;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.sql.entity.TableBookmark;

@Service
public class TableBookmarkService {

        @Autowired
        private TableBookmarkRepository tableBookmarkRepository;

        public List<TableBookmark> findAllBy(TableBookmark tableBookmark) {

                Specification<TableBookmark> spec = Specification.where(null);
                spec = spec.and((root, query, cb) -> cb.and(cb.equal(root.get("name"), tableBookmark.getName()),
                                cb.equal(root.get("owner"), tableBookmark.getOwner())));

                // tableName OR comments
                Specification<TableBookmark> orSpec = Specification.where(null);
                if (tableBookmark.getTableName() != null && !tableBookmark.getTableName().isEmpty()) {
                        orSpec = orSpec.or((root, query, cb) -> cb.equal(root.get("tableName"), tableBookmark.getTableName()));
                        orSpec = orSpec.or((root, query, cb) -> cb.like(root.get("comments"), "%" + tableBookmark.getTableName() + "%"));
                }
                if (tableBookmark.getComments() != null && !tableBookmark.getComments().isEmpty()) {
                        orSpec = orSpec.or((root, query, cb) -> cb.like(root.get("comments"), "%" + tableBookmark.getComments() + "%"));
                }

                spec = spec.and(orSpec);

                return tableBookmarkRepository.findAll(spec);
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
