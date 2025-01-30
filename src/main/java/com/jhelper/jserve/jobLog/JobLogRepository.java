package com.jhelper.jserve.jobLog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.jhelper.jserve.jobLog.entity.JobLog;

@Repository
public interface JobLogRepository extends JpaRepository<JobLog, Integer>, JpaSpecificationExecutor<JobLog> {
}
