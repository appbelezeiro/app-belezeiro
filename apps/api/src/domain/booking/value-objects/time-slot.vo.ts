export class TimeSlot {
  constructor(
    private readonly start: Date,
    private readonly end: Date,
  ) {
    if (start >= end) {
      throw new Error('Start time must be before end time');
    }
  }

  overlaps(other: TimeSlot): boolean {
    return this.start < other.end && this.end > other.start;
  }

  contains(time: Date): boolean {
    return time >= this.start && time < this.end;
  }

  duration(): number {
    return Math.floor((this.end.getTime() - this.start.getTime()) / 60000);
  }

  getStart(): Date {
    return this.start;
  }

  getEnd(): Date {
    return this.end;
  }
}
