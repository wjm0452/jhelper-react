package com.jhelper.jserve.sql;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jhelper.jserve.sql.entity.ConnInfo;

@Repository
public interface ConnInfoRepository extends JpaRepository<ConnInfo, String> {

}
