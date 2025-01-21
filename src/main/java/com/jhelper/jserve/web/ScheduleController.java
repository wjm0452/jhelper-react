package com.jhelper.jserve.web;

import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jhelper.jserve.schedule.ScheduleService;
import com.jhelper.jserve.schedule.entity.Schedule;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    ScheduleService scheduleService;

    @GetMapping
    public List<Schedule> allSchedule(
            @RequestParam(name = "year") int year,
            @RequestParam(name = "month") int month) {
        return scheduleService.findAll(year, month);
    }

    @GetMapping("/{id}")
    public Schedule schedule(@PathVariable Integer id) {
        return scheduleService.findById(id);
    }

    @PostMapping
    public Schedule createSchedule(@RequestBody Schedule schedule, @AuthenticationPrincipal UserDetails userDetails) {
        schedule.setRegisterId(userDetails.getUsername());
        schedule.setRegisterDate(new Date());
        return scheduleService.create(schedule);
    }

    @PutMapping
    public Schedule updateSchedule(@RequestBody Schedule schedule, @AuthenticationPrincipal UserDetails userDetails) {

        Schedule savedSchedule = scheduleService.findById(schedule.getId());

        if (!userDetails.getUsername().equals(savedSchedule.getRegisterId())) {
            throw new AccessDeniedException("변경할 수 없습니다.");
        }

        return scheduleService.update(schedule);
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Integer id, @AuthenticationPrincipal UserDetails userDetails) {

        Schedule savedSchedule = scheduleService.findById(id);

        if (!userDetails.getUsername().equals(savedSchedule.getRegisterId())) {
            throw new AccessDeniedException("삭제할 수 없습니다.");
        }

        scheduleService.delete(id);
    }
}
