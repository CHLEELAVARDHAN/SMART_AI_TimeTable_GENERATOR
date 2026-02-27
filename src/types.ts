export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface PeriodTiming {
  startTime: string;
  endTime: string;
  isLunch?: boolean;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  facultyName: string;
  facultyPhone?: string;
  weeklyHours: number;
  isLab: boolean;
  preferredSlots?: { day: Day; periodIndex: number }[];
}

export interface TimetableConfig {
  id: string;
  department: string;
  course: string;
  year: string;
  semester: string;
  section: string;
  academicYear: string;
  roomNumber: string;
  classTeacher: string;
  strength: string;
  wef: string;
  workingDays: Day[];
  periodTimings: PeriodTiming[];
  subjects: Subject[];
}

export interface ScheduledPeriod {
  subjectCode: string;
  facultyName: string;
  isLab: boolean;
}

export type TimetableGrid = (ScheduledPeriod | null)[][]; // [dayIndex][periodIndex]

export interface TimetableResult {
  config: TimetableConfig;
  grid: TimetableGrid;
}

export interface GlobalFacultySchedule {
  [facultyName: string]: {
    [day: string]: {
      [periodIndex: number]: string; // class/section name
    };
  };
}
