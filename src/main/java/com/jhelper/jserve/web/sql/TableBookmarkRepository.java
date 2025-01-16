package com.jhelper.jserve.web.sql;

import com.jhelper.jserve.web.entity.TableBookmark;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TableBookmarkRepository extends JpaRepository<TableBookmark, TableBookmark.PK> {

}
