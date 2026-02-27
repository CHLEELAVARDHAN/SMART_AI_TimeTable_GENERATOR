import { Day, PeriodTiming, Subject, TimetableConfig } from "./types";

export const DEFAULT_PERIOD_TIMINGS: PeriodTiming[] = [
  { startTime: "09:00", endTime: "10:00" },
  { startTime: "10:00", endTime: "11:00" },
  { startTime: "11:00", endTime: "11:15" },
  { startTime: "11:15", endTime: "12:15" },
  { startTime: "12:15", endTime: "13:15" },
  { startTime: "13:15", endTime: "14:00", isLunch: true },
  { startTime: "14:00", endTime: "15:00" },
  { startTime: "15:00", endTime: "16:00" },
];

export const DAYS: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const createEmptyConfig = (id: string): TimetableConfig => ({
  id,
  department: "",
  course: "",
  year: "",
  semester: "",
  section: "",
  academicYear: "2023-24",
  roomNumber: "",
  classTeacher: "",
  strength: "",
  wef: "",
  workingDays: [...DAYS],
  periodTimings: [...DEFAULT_PERIOD_TIMINGS],
  subjects: [],
});
