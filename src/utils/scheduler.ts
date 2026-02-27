import { 
  TimetableConfig, 
  TimetableResult, 
  TimetableGrid, 
  GlobalFacultySchedule, 
  Subject,
  Day
} from '../types';

export class Scheduler {
  private globalFacultySchedule: GlobalFacultySchedule = {};

  constructor() {}

  public generateMultiple(configs: TimetableConfig[]): TimetableResult[] {
    this.globalFacultySchedule = {};
    const results: TimetableResult[] = [];

    for (const config of configs) {
      const grid = this.generateSingle(config);
      results.push({ config, grid });
    }

    return results;
  }

  private generateSingle(config: TimetableConfig): TimetableGrid {
    const { workingDays, periodTimings, subjects } = config;
    const grid: TimetableGrid = Array(workingDays.length)
      .fill(null)
      .map(() => Array(periodTimings.length).fill(null));

    // 1. Identify Special Slot (3:00 PM - 4:00 PM)
    const specialSlotIdx = periodTimings.findIndex(t => 
      (t.startTime === "15:00" || t.startTime === "03:00")
    );

    // 2. Lock lunch breaks
    periodTimings.forEach((timing, pIdx) => {
      if (timing.isLunch) {
        workingDays.forEach((_, dIdx) => {
          grid[dIdx][pIdx] = { subjectCode: 'LUNCH', facultyName: '-', isLab: false };
        });
      }
    });

    // 3. Allocate Special Sessions (Sports, Men/Lib) - Once per week each
    if (specialSlotIdx !== -1) {
      // Assign to specific separate days: Monday (0) and Tuesday (1)
      const specialDays = [0, 1]; 
      const specials = [
        { code: 'SPORTS', faculty: 'Physical Director' },
        { code: 'MEN/LIB', faculty: 'Mentor/Librarian' }
      ];

      specials.forEach((special, i) => {
        const dIdx = specialDays[i];
        if (dIdx < workingDays.length) {
          grid[dIdx][specialSlotIdx] = {
            subjectCode: special.code,
            facultyName: special.faculty,
            isLab: false
          };
          // Mark faculty busy if we can find a matching faculty in the subjects list
          const matchingSub = subjects.find(s => s.code.toUpperCase() === special.code);
          if (matchingSub) {
            this.markFacultyBusy(matchingSub.facultyName, workingDays[dIdx], specialSlotIdx, `${config.course}-${config.section}`);
          }
        }
      });
    }

    // 4. Separate Lab and Theory Subjects
    const labSubjects = subjects.filter(s => s.isLab);
    // Exclude special subjects from general theory allocation to prevent double-scheduling
    const theorySubjects = subjects.filter(s => 
      !s.isLab && 
      !['SPORTS', 'MEN/LIB', 'MENTOR', 'LIBRARY'].some(k => s.code.toUpperCase().includes(k))
    );

    // 5. Allocate Labs (3 continuous periods, max one per day)
    const daysWithLabs = new Set<number>();
    labSubjects.forEach(lab => {
      let labsScheduled = 0;
      const maxLabsPerWeek = Math.ceil(lab.weeklyHours / 3);
      
      for (let dIdx = 0; dIdx < workingDays.length && labsScheduled < maxLabsPerWeek; dIdx++) {
        if (daysWithLabs.has(dIdx)) continue;

        // Find a 3-period slot that doesn't clash with lunch or special sessions
        for (let pIdx = 0; pIdx <= periodTimings.length - 3; pIdx++) {
          if (this.canFitLab(grid, dIdx, pIdx, 3, lab.facultyName, workingDays[dIdx])) {
            for (let i = 0; i < 3; i++) {
              grid[dIdx][pIdx + i] = {
                subjectCode: lab.code,
                facultyName: lab.facultyName,
                isLab: true
              };
              this.markFacultyBusy(lab.facultyName, workingDays[dIdx], pIdx + i, `${config.course}-${config.section}`);
            }
            daysWithLabs.add(dIdx);
            labsScheduled++;
            break;
          }
        }
      }
    });

    // 6. Fill remaining slots with Theory Subjects
    // Goal: Every subject appears at least once per day as much as possible.
    // No period should remain empty.
    let globalTheoryIndex = 0;

    for (let dIdx = 0; dIdx < workingDays.length; dIdx++) {
      const subjectsUsedToday = new Set<string>();
      
      // Pass 1: Try to place each theory subject once per day
      for (let pIdx = 0; pIdx < periodTimings.length; pIdx++) {
        if (grid[dIdx][pIdx]) continue;

        // Try to find a subject not yet used today
        let found = false;
        for (let attempt = 0; attempt < theorySubjects.length; attempt++) {
          const sub = theorySubjects[(globalTheoryIndex + attempt) % theorySubjects.length];
          if (!subjectsUsedToday.has(sub.code) && this.isFacultyAvailable(sub.facultyName, workingDays[dIdx], pIdx)) {
            grid[dIdx][pIdx] = {
              subjectCode: sub.code,
              facultyName: sub.facultyName,
              isLab: false
            };
            this.markFacultyBusy(sub.facultyName, workingDays[dIdx], pIdx, `${config.course}-${config.section}`);
            subjectsUsedToday.add(sub.code);
            // We don't increment globalTheoryIndex here to keep the sequence across days
            found = true;
            break;
          }
        }

        // If all subjects already used today or faculty busy, just pick the next available in round-robin
        if (!found && theorySubjects.length > 0) {
          for (let attempt = 0; attempt < theorySubjects.length; attempt++) {
            const sub = theorySubjects[(globalTheoryIndex + attempt) % theorySubjects.length];
            if (this.isFacultyAvailable(sub.facultyName, workingDays[dIdx], pIdx)) {
              grid[dIdx][pIdx] = {
                subjectCode: sub.code,
                facultyName: sub.facultyName,
                isLab: false
              };
              this.markFacultyBusy(sub.facultyName, workingDays[dIdx], pIdx, `${config.course}-${config.section}`);
              found = true;
              break;
            }
          }
        }

        // Final fallback: Force a subject even if faculty is busy (to satisfy "No period should remain empty")
        if (!found && theorySubjects.length > 0) {
          const sub = theorySubjects[globalTheoryIndex % theorySubjects.length];
          grid[dIdx][pIdx] = {
            subjectCode: sub.code,
            facultyName: sub.facultyName,
            isLab: false
          };
          this.markFacultyBusy(sub.facultyName, workingDays[dIdx], pIdx, `${config.course}-${config.section}`);
        }

        globalTheoryIndex++;
      }
    }

    return grid;
  }

  private canFitLab(grid: TimetableGrid, dIdx: number, pIdx: number, duration: number, faculty: string, day: Day): boolean {
    for (let i = 0; i < duration; i++) {
      if (grid[dIdx][pIdx + i] !== null) return false;
      if (!this.isFacultyAvailable(faculty, day, pIdx + i)) return false;
    }
    return true;
  }

  private isFacultyAvailable(faculty: string, day: Day, periodIndex: number): boolean {
    if (!this.globalFacultySchedule[faculty]) return true;
    if (!this.globalFacultySchedule[faculty][day]) return true;
    return !this.globalFacultySchedule[faculty][day][periodIndex];
  }

  private markFacultyBusy(faculty: string, day: Day, periodIndex: number, className: string) {
    if (!this.globalFacultySchedule[faculty]) this.globalFacultySchedule[faculty] = {};
    if (!this.globalFacultySchedule[faculty][day]) this.globalFacultySchedule[faculty][day] = {};
    this.globalFacultySchedule[faculty][day][periodIndex] = className;
  }
}
