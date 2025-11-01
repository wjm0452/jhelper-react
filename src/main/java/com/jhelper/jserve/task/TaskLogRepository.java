package com.jhelper.jserve.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.jhelper.jserve.task.entity.TaskLog;

@Repository
public interface TaskLogRepository extends JpaRepository<TaskLog, Integer>, JpaSpecificationExecutor<TaskLog> {
}
