import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSchedule, getScheduleList, saveSchedules, saveSchedule } from "./schedule.api";

export const useGetScheduleList = ({ year, month }: { year: number; month: number }) => {
  return useQuery({
    queryKey: ["scheduleList", year, month],
    queryFn: (): Promise<Schedule[]> => getScheduleList(year, month),
  });
};

export const useSaveSchedules = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schedules: Schedule[]): Promise<Schedule[]> => saveSchedules(schedules),
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["scheduleList"] }),
  });
};

export const useSaveSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schedule: Schedule): Promise<Schedule> => saveSchedule(schedule),
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["scheduleList"] }),
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number): Promise<Schedule> => deleteSchedule(id),
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["scheduleList"] }),
  });
};
