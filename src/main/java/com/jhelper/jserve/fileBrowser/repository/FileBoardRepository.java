package com.jhelper.jserve.fileBrowser.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jhelper.jserve.fileBrowser.entity.FileBoard;

@Repository
public interface FileBoardRepository extends JpaRepository<FileBoard, String> {
    public FileBoard findByFilePath(String filePath);
}
