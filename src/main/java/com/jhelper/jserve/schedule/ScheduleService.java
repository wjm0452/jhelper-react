package com.jhelper.jserve.schedule;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.schedule.entity.Schedule;

@Service
public class ScheduleService {

    @Autowired
    ScheduleRepository scheduleRepository;

    public List<Schedule> findAll(int year, int month) {

        String date = String.format("%d-%02d", year, month);

        Schedule schedule = new Schedule();
        schedule.setFromDate(date);
        schedule.setToDate(date);

        ExampleMatcher matcher = ExampleMatcher.matchingAny()
                .withMatcher("fromDate", match -> match.startsWith())
                .withMatcher("toDate", match -> match.startsWith());

        return scheduleRepository.findAll(Example.of(schedule, matcher), Sort.by("fromDate", "toDate").ascending());
    }

    public Schedule findById(Integer id) {
        return scheduleRepository.findById(id).orElse(null);
    }

    public Schedule create(Schedule schedule) {
        schedule.setRegisterDate(new Date());
        return scheduleRepository.save(schedule);
    }

    public Schedule update(Schedule schedule) {
        Schedule oldSchedule = findById(schedule.getId());

        if (oldSchedule == null) {
            return null;
        }

        if (schedule.getTitle() != null && schedule.getTitle().length() > 0) {
            oldSchedule.setTitle(schedule.getTitle());
        }
        if (schedule.getContent() != null && schedule.getContent().length() > 0) {
            oldSchedule.setContent(schedule.getContent());
        }

        oldSchedule.setFromDate(schedule.getFromDate());
        oldSchedule.setToDate(schedule.getToDate());

        return scheduleRepository.save(oldSchedule);
    }

    public void delete(Integer id) {
        scheduleRepository.deleteById(id);
    }

}
