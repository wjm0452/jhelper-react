import httpClient from "../../common/httpClient";

export const getSchedule = async (id: string): Promise<Schedule> => {
  const data = await httpClient.get(`/api/schedule/${id}`);

  if (data.registerDate) {
    data.registerDate = data.registerDate.slice(0, 16);
  }

  return data;
};

export const getScheduleList = async (year: number, month: number): Promise<Schedule[]> => {
  return await httpClient.get("/api/schedule", null, {
    params: {
      year,
      month,
    },
  });
};

export const createSchedule = async (obj: Schedule): Promise<Schedule> => {
  return await httpClient.post("/api/schedule", obj);
};

export const updateSchedule = async (obj: Schedule): Promise<Schedule> => {
  return await httpClient.put("/api/schedule", obj);
};

export const saveSchedules = async (obj: Schedule[]): Promise<Schedule[]> => {
  return await httpClient.post("/api/schedule/batch", obj);
};

export const saveSchedule = async (data: Schedule): Promise<Schedule> => {
  const item = data;
  if (!item.content.trim()) {
    return;
  }

  if (item.id) {
    return updateSchedule(data);
  } else {
    return createSchedule(data);
  }
};

export const deleteSchedule = async (id: number): Promise<Schedule> => {
  return await httpClient.delete(`/api/schedule/${id}`);
};

export default {
  getSchedule,
  getScheduleList,
  createSchedule,
  updateSchedule,
  saveSchedules,
  saveSchedule,
  deleteSchedule,
};
