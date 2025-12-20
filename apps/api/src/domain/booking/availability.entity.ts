import { BaseEntity, BaseEntityProps } from '../entities/base/base-entity';
import { AvailabilityEvents } from './availability.events';

export interface AvailabilityProps extends BaseEntityProps {
  professionalProfileId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export class Availability extends BaseEntity<AvailabilityProps> {
  protected prefix(): string {
    return 'avail';
  }

  private constructor(props: AvailabilityProps) {
    super(props);
    this.validate();
  }

  private validate(): void {
    if (this.props.dayOfWeek < 0 || this.props.dayOfWeek > 6) {
      throw new Error('dayOfWeek must be between 0 and 6');
    }

    if (!this.isValidTimeFormat(this.props.startTime)) {
      throw new Error('startTime must be in HH:mm format');
    }

    if (!this.isValidTimeFormat(this.props.endTime)) {
      throw new Error('endTime must be in HH:mm format');
    }

    if (this.props.startTime >= this.props.endTime) {
      throw new Error('startTime must be before endTime');
    }
  }

  private isValidTimeFormat(time: string): boolean {
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  }

  static create(data: {
    professionalProfileId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive?: boolean;
  }): Availability {
    return new Availability({
      professionalProfileId: data.professionalProfileId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      isActive: data.isActive ?? true,
    });
  }

  static reconstitute(data: {
    id: string;
    professionalProfileId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Availability {
    return new Availability({
      id: data.id,
      professionalProfileId: data.professionalProfileId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get professionalProfileId(): string {
    return this.props.professionalProfileId;
  }

  get dayOfWeek(): number {
    return this.props.dayOfWeek;
  }

  get startTime(): string {
    return this.props.startTime;
  }

  get endTime(): string {
    return this.props.endTime;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  update(data: {
    startTime?: string;
    endTime?: string;
    isActive?: boolean;
  }): void {
    if (data.startTime !== undefined) {
      this.props.startTime = data.startTime;
    }

    if (data.endTime !== undefined) {
      this.props.endTime = data.endTime;
    }

    if (data.isActive !== undefined) {
      this.props.isActive = data.isActive;
    }

    this.validate();
    this.touch();
  }

  isWorkingDay(): boolean {
    return this.props.isActive;
  }

  getWorkingHours(): { start: string; end: string } {
    return {
      start: this.props.startTime,
      end: this.props.endTime,
    };
  }
}
