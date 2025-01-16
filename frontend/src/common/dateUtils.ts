import { DateTime } from "luxon";

export const dateUtils = {
  toString: (d: Date, format?: string) => {
    if (!format) {
      format = "yyyy-MM-dd HH:mm";
    }
    return d ? DateTime.fromJSDate(d).toFormat(format).toString() : null;
  },
  toJSON: (d: Date) => {
    return d ? DateTime.fromJSDate(d).toString().substring(0, 16) : null;
  },
  toDate: (dateString: string) => {
    return dateString ? new Date(dateString) : null;
  },
};
