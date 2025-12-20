import { AggregateRoot, BaseEntityProps } from '../../entities/base/aggregate-root';
import { ProfessionalService } from './professional-service.entity';
import { DisplayName } from './value-objects/display-name.vo';
import { YearsOfExperience } from './value-objects/years-experience.vo';
import { ProfessionalProfileEvents } from './professional-profile.events';

export interface ProfessionalProfileProps extends BaseEntityProps {
  userId: string;
  displayName: DisplayName;
  bio?: string;
  yearsOfExperience?: YearsOfExperience;
  achievements: string[];
  specialties: string[];
  services: ProfessionalService[];
  slotDurationMinutes: number;
  minAdvanceMinutes: number;
  maxAdvanceDays: number;
  bufferMinutes: number;
}

export interface BookingRules {
  slotDurationMinutes: number;
  minAdvanceMinutes: number;
  maxAdvanceDays: number;
  bufferMinutes: number;
}

export class ProfessionalProfile extends AggregateRoot<ProfessionalProfileProps> {
  get aggregateType(): string {
    return 'ProfessionalProfile';
  }

  protected prefix(): string {
    return 'prof';
  }

  private constructor(props: ProfessionalProfileProps) {
    super(props);
  }

  static create(data: {
    userId: string;
    displayName: DisplayName;
    bio?: string;
    yearsOfExperience?: YearsOfExperience;
    achievements?: string[];
    specialties?: string[];
    slotDurationMinutes?: number;
    minAdvanceMinutes?: number;
    maxAdvanceDays?: number;
    bufferMinutes?: number;
  }): ProfessionalProfile {
    const profile = new ProfessionalProfile({
      userId: data.userId,
      displayName: data.displayName,
      bio: data.bio,
      yearsOfExperience: data.yearsOfExperience,
      achievements: data.achievements ?? [],
      specialties: data.specialties ?? [],
      services: [],
      slotDurationMinutes: data.slotDurationMinutes ?? 30,
      minAdvanceMinutes: data.minAdvanceMinutes ?? 60,
      maxAdvanceDays: data.maxAdvanceDays ?? 30,
      bufferMinutes: data.bufferMinutes ?? 0,
    });

    profile.raise({
      eventType: ProfessionalProfileEvents.ProfessionalProfileCreated,
      aggregateId: profile.id,
      aggregateType: 'ProfessionalProfile',
      payload: {
        professionalProfileId: profile.id,
        userId: data.userId,
        displayName: data.displayName.value,
      },
    });

    return profile;
  }

  static reconstitute(data: {
    id: string;
    userId: string;
    displayName: DisplayName;
    bio?: string;
    yearsOfExperience?: YearsOfExperience;
    achievements: string[];
    specialties: string[];
    services: ProfessionalService[];
    slotDurationMinutes: number;
    minAdvanceMinutes: number;
    maxAdvanceDays: number;
    bufferMinutes: number;
    createdAt: Date;
    updatedAt: Date;
  }): ProfessionalProfile {
    return new ProfessionalProfile({
      id: data.id,
      userId: data.userId,
      displayName: data.displayName,
      bio: data.bio,
      yearsOfExperience: data.yearsOfExperience,
      achievements: data.achievements,
      specialties: data.specialties,
      services: data.services,
      slotDurationMinutes: data.slotDurationMinutes,
      minAdvanceMinutes: data.minAdvanceMinutes,
      maxAdvanceDays: data.maxAdvanceDays,
      bufferMinutes: data.bufferMinutes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get userId(): string {
    return this.props.userId;
  }

  get displayName(): DisplayName {
    return this.props.displayName;
  }

  get bio(): string | undefined {
    return this.props.bio;
  }

  get yearsOfExperience(): YearsOfExperience | undefined {
    return this.props.yearsOfExperience;
  }

  get achievements(): readonly string[] {
    return this.props.achievements;
  }

  get specialties(): readonly string[] {
    return this.props.specialties;
  }

  get services(): readonly ProfessionalService[] {
    return this.props.services;
  }

  get slotDurationMinutes(): number {
    return this.props.slotDurationMinutes;
  }

  get minAdvanceMinutes(): number {
    return this.props.minAdvanceMinutes;
  }

  get maxAdvanceDays(): number {
    return this.props.maxAdvanceDays;
  }

  get bufferMinutes(): number {
    return this.props.bufferMinutes;
  }

  updateProfile(data: {
    displayName?: DisplayName;
    bio?: string;
    yearsOfExperience?: YearsOfExperience;
    achievements?: string[];
    specialties?: string[];
  }): void {
    if (data.displayName !== undefined) {
      this.props.displayName = data.displayName;
    }

    if (data.bio !== undefined) {
      this.props.bio = data.bio;
    }

    if (data.yearsOfExperience !== undefined) {
      this.props.yearsOfExperience = data.yearsOfExperience;
    }

    if (data.achievements !== undefined) {
      this.props.achievements = data.achievements;
    }

    if (data.specialties !== undefined) {
      this.props.specialties = data.specialties;
    }

    this.touch();

    this.raise({
      eventType: ProfessionalProfileEvents.ProfessionalProfileUpdated,
      aggregateId: this.id,
      aggregateType: 'ProfessionalProfile',
      payload: {
        professionalProfileId: this.id,
      },
    });
  }

  updateBookingRules(data: {
    slotDurationMinutes?: number;
    minAdvanceMinutes?: number;
    maxAdvanceDays?: number;
    bufferMinutes?: number;
  }): void {
    if (data.slotDurationMinutes !== undefined) {
      if (!this.validateSlotDuration(data.slotDurationMinutes)) {
        throw new Error('slotDurationMinutes must be 15, 30, or 60');
      }
      this.props.slotDurationMinutes = data.slotDurationMinutes;
    }

    if (data.minAdvanceMinutes !== undefined) {
      if (data.minAdvanceMinutes < 0) {
        throw new Error('minAdvanceMinutes must be >= 0');
      }
      this.props.minAdvanceMinutes = data.minAdvanceMinutes;
    }

    if (data.maxAdvanceDays !== undefined) {
      if (data.maxAdvanceDays <= 0) {
        throw new Error('maxAdvanceDays must be > 0');
      }
      this.props.maxAdvanceDays = data.maxAdvanceDays;
    }

    if (data.bufferMinutes !== undefined) {
      if (data.bufferMinutes < 0) {
        throw new Error('bufferMinutes must be >= 0');
      }
      this.props.bufferMinutes = data.bufferMinutes;
    }

    this.touch();
  }

  getBookingRules(): BookingRules {
    return {
      slotDurationMinutes: this.props.slotDurationMinutes,
      minAdvanceMinutes: this.props.minAdvanceMinutes,
      maxAdvanceDays: this.props.maxAdvanceDays,
      bufferMinutes: this.props.bufferMinutes,
    };
  }

  validateSlotDuration(minutes: number): boolean {
    return minutes === 15 || minutes === 30 || minutes === 60;
  }

  addService(data: {
    serviceId: string;
    customDuration?: number;
  }): void {
    const service = ProfessionalService.create({
      professionalProfileId: this.id,
      serviceId: data.serviceId,
      customDuration: data.customDuration,
    });

    this.props.services.push(service);
    this.touch();

    this.raise({
      eventType: ProfessionalProfileEvents.ProfessionalServiceAdded,
      aggregateId: this.id,
      aggregateType: 'ProfessionalProfile',
      payload: {
        professionalProfileId: this.id,
        serviceId: data.serviceId,
        professionalServiceId: service.id,
      },
    });
  }

  removeService(serviceId: string): void {
    const index = this.props.services.findIndex((s) => s.serviceId === serviceId);

    if (index === -1) {
      throw new Error(`Service ${serviceId} not found`);
    }

    this.props.services.splice(index, 1);
    this.touch();

    this.raise({
      eventType: ProfessionalProfileEvents.ProfessionalServiceRemoved,
      aggregateId: this.id,
      aggregateType: 'ProfessionalProfile',
      payload: {
        professionalProfileId: this.id,
        serviceId,
      },
    });
  }

  updateServiceDuration(serviceId: string, duration: number | undefined): void {
    const service = this.props.services.find((s) => s.serviceId === serviceId);

    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    service.updateDuration(duration);
    this.touch();

    this.raise({
      eventType: ProfessionalProfileEvents.ProfessionalServiceDurationUpdated,
      aggregateId: this.id,
      aggregateType: 'ProfessionalProfile',
      payload: {
        professionalProfileId: this.id,
        serviceId,
        customDuration: duration,
      },
    });
  }
}
