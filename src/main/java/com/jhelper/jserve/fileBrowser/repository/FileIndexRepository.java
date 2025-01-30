package com.jhelper.jserve.fileBrowser.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jhelper.jserve.fileBrowser.entity.FileIndex;

public interface FileIndexRepository extends JpaRepository<FileIndex, String> {
    @Query("delete from fileIndex c where c.parentPath in :parentPaths")
    void deleteAllByParentPath(@Param("parentPaths") Iterable<String> parentPaths);
}