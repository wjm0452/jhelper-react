package com.jhelper.jserve.web.schedule;

import com.jhelper.jserve.web.entity.Schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {

}
