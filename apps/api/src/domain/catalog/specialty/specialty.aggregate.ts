import { AggregateRoot, BaseEntityProps } from '../../entities/base/aggregate-root';
import { SpecialtyEvents } from './specialty.events';

export interface SpecialtyProps extends BaseEntityProps {
  name: string;
  description?: string;
  icon?: string;
  isGlobal: boolean;
  ownerId?: string;
}

export class Specialty extends AggregateRoot<SpecialtyProps> {
  get aggregateType(): string {
    return 'Specialty';
  }

  protected prefix(): string {
    return 'spec';
  }

  private constructor(props: SpecialtyProps) {
    super(props);
    this.validate();
  }

  private validate(): void {
    if (this.props.isGlobal && this.props.ownerId) {
      throw new Error('Global specialty cannot have ownerId');
    }

    if (!this.props.isGlobal && !this.props.ownerId) {
      throw new Error('Custom specialty must have ownerId');
    }
  }

  static createGlobal(data: {
    name: string;
    description?: string;
    icon?: string;
  }): Specialty {
    const specialty = new Specialty({
      name: data.name,
      description: data.description,
      icon: data.icon,
      isGlobal: true,
      ownerId: undefined,
    });

    specialty.raise({
      eventType: SpecialtyEvents.SpecialtyCreated,
      aggregateId: specialty.id,
      aggregateType: 'Specialty',
      payload: {
        specialtyId: specialty.id,
        name: data.name,
        isGlobal: true,
      },
    });

    return specialty;
  }

  static createCustom(data: {
    professionalProfileId: string;
    name: string;
    description?: string;
    icon?: string;
  }): Specialty {
    const specialty = new Specialty({
      name: data.name,
      description: data.description,
      icon: data.icon,
      isGlobal: false,
      ownerId: data.professionalProfileId,
    });

    specialty.raise({
      eventType: SpecialtyEvents.SpecialtyCreated,
      aggregateId: specialty.id,
      aggregateType: 'Specialty',
      payload: {
        specialtyId: specialty.id,
        name: data.name,
        isGlobal: false,
        ownerId: data.professionalProfileId,
      },
    });

    return specialty;
  }

  static reconstitute(data: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    isGlobal: boolean;
    ownerId?: string;
    createdAt: Date;
    updatedAt: Date;
  }): Specialty {
    return new Specialty({
      id: data.id,
      name: data.name,
      description: data.description,
      icon: data.icon,
      isGlobal: data.isGlobal,
      ownerId: data.ownerId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get icon(): string | undefined {
    return this.props.icon;
  }

  get isGlobal(): boolean {
    return this.props.isGlobal;
  }

  get ownerId(): string | undefined {
    return this.props.ownerId;
  }

  update(data: { name?: string; description?: string; icon?: string }): void {
    if (data.name !== undefined) {
      this.props.name = data.name;
    }

    if (data.description !== undefined) {
      this.props.description = data.description;
    }

    if (data.icon !== undefined) {
      this.props.icon = data.icon;
    }

    this.touch();
  }
}
