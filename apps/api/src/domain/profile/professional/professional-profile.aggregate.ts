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
  }): ProfessionalProfile {
    const profile = new ProfessionalProfile({
      userId: data.userId,
      displayName: data.displayName,
      bio: data.bio,
      yearsOfExperience: data.yearsOfExperience,
      achievements: data.achievements ?? [],
      specialties: data.specialties ?? [],
      services: [],
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

  linkToUnit(unitId: string): void {
    this.touch();

    this.raise({
      eventType: ProfessionalProfileEvents.ProfessionalUnitLinked,
      aggregateId: this.id,
      aggregateType: 'ProfessionalProfile',
      payload: {
        professionalProfileId: this.id,
        unitId,
      },
    });
  }

  unlinkFromUnit(unitId: string, hasActiveBookings: boolean): void {
    if (hasActiveBookings) {
      throw new Error('Cannot unlink professional with active bookings');
    }

    this.touch();

    this.raise({
      eventType: ProfessionalProfileEvents.ProfessionalUnitUnlinked,
      aggregateId: this.id,
      aggregateType: 'ProfessionalProfile',
      payload: {
        professionalProfileId: this.id,
        unitId,
      },
    });
  }

  addService(data: {
    serviceId: string;
    customPrice?: number;
    customDuration?: number;
  }): void {
    const service = ProfessionalService.create({
      professionalProfileId: this.id,
      serviceId: data.serviceId,
      customPrice: data.customPrice,
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

  updateServicePrice(serviceId: string, price: number | undefined): void {
    const service = this.props.services.find((s) => s.serviceId === serviceId);

    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    service.updatePrice(price);
    this.touch();

    this.raise({
      eventType: ProfessionalProfileEvents.ProfessionalServicePriceUpdated,
      aggregateId: this.id,
      aggregateType: 'ProfessionalProfile',
      payload: {
        professionalProfileId: this.id,
        serviceId,
        customPrice: price,
      },
    });
  }
}
