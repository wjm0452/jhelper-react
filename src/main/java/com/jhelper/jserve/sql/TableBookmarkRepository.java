package com.jhelper.jserve.sql;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.jhelper.jserve.sql.entity.TableBookmark;

@Repository
public interface TableBookmarkRepository
        extends JpaRepository<TableBookmark, TableBookmark.PK>, JpaSpecificationExecutor<TableBookmark> {

}
