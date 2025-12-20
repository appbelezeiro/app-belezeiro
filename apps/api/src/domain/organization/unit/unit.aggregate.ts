import { AggregateRoot, BaseEntityProps } from '../../entities/base/aggregate-root';
import { UnitAddress } from './unit-address.entity';
import { UnitEvents } from './unit.events';

export interface UnitProps extends BaseEntityProps {
  organizationId: string;
  name: string;
  slug: string;
  isSoloProfessional: boolean;
  phone?: string;
  email?: string;
  address?: UnitAddress;
  deletedAt?: Date;
}

export class Unit extends AggregateRoot<UnitProps> {
  get aggregateType(): string {
    return 'Unit';
  }

  protected prefix(): string {
    return 'unit';
  }

  private constructor(props: UnitProps) {
    super(props);
  }

  static create(data: {
    organizationId: string;
    name: string;
    slug: string;
    isSoloProfessional: boolean;
    phone?: string;
    email?: string;
  }): Unit {
    const unit = new Unit({
      organizationId: data.organizationId,
      name: data.name,
      slug: data.slug,
      isSoloProfessional: data.isSoloProfessional,
      phone: data.phone,
      email: data.email,
    });

    unit.raise({
      eventType: UnitEvents.UnitCreated,
      aggregateId: unit.id,
      aggregateType: 'Unit',
      payload: {
        unitId: unit.id,
        organizationId: data.organizationId,
        name: data.name,
        isSoloProfessional: data.isSoloProfessional,
      },
    });

    return unit;
  }

  static reconstitute(data: {
    id: string;
    organizationId: string;
    name: string;
    slug: string;
    isSoloProfessional: boolean;
    phone?: string;
    email?: string;
    address?: UnitAddress;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }): Unit {
    return new Unit({
      id: data.id,
      organizationId: data.organizationId,
      name: data.name,
      slug: data.slug,
      isSoloProfessional: data.isSoloProfessional,
      phone: data.phone,
      email: data.email,
      address: data.address,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get isSoloProfessional(): boolean {
    return this.props.isSoloProfessional;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  get address(): UnitAddress | undefined {
    return this.props.address;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  setAddress(address: UnitAddress): void {
    this.props.address = address;
  }

  update(data: {
    name?: string;
    slug?: string;
    phone?: string;
    email?: string;
  }): void {
    const changedFields: string[] = [];

    if (data.name !== undefined && data.name !== this.props.name) {
      this.props.name = data.name;
      changedFields.push('name');
    }

    if (data.slug !== undefined && data.slug !== this.props.slug) {
      this.props.slug = data.slug;
      changedFields.push('slug');
    }

    if (data.phone !== undefined && data.phone !== this.props.phone) {
      this.props.phone = data.phone;
      changedFields.push('phone');
    }

    if (data.email !== undefined && data.email !== this.props.email) {
      this.props.email = data.email;
      changedFields.push('email');
    }

    if (changedFields.length > 0) {
      this.touch();

      this.raise({
        eventType: UnitEvents.UnitUpdated,
        aggregateId: this.id,
        aggregateType: 'Unit',
        payload: {
          unitId: this.id,
          changedFields,
        },
      });
    }
  }

  softDelete(): void {
    this.props.deletedAt = new Date();
    this.touch();

    this.raise({
      eventType: UnitEvents.UnitDeleted,
      aggregateId: this.id,
      aggregateType: 'Unit',
      payload: {
        unitId: this.id,
        deletedAt: this.props.deletedAt,
      },
    });
  }

  canDelete(hasActiveBookings: boolean): boolean {
    return !hasActiveBookings;
  }

  setSoloProfessional(value: boolean, professionalProfileId?: string): void {
    const oldValue = this.props.isSoloProfessional;
    this.props.isSoloProfessional = value;
    this.touch();

    if (value && !oldValue) {
      this.raise({
        eventType: UnitEvents.UnitSoloProfessionalEnabled,
        aggregateId: this.id,
        aggregateType: 'Unit',
        payload: {
          unitId: this.id,
          professionalProfileId,
        },
      });
    } else if (!value && oldValue) {
      this.raise({
        eventType: UnitEvents.UnitSoloProfessionalDisabled,
        aggregateId: this.id,
        aggregateType: 'Unit',
        payload: {
          unitId: this.id,
        },
      });
    }
  }

  onProfessionalAdded(professionalCount: number): void {
    if (professionalCount >= 2 && this.props.isSoloProfessional) {
      this.props.isSoloProfessional = false;
      this.touch();

      this.raise({
        eventType: UnitEvents.UnitSoloProfessionalDisabled,
        aggregateId: this.id,
        aggregateType: 'Unit',
        payload: {
          unitId: this.id,
        },
      });
    }
  }

  onProfessionalRemoved(professionalCount: number, professionalProfileId?: string): void {
    if (professionalCount <= 1 && !this.props.isSoloProfessional) {
      this.props.isSoloProfessional = true;
      this.touch();

      this.raise({
        eventType: UnitEvents.UnitSoloProfessionalEnabled,
        aggregateId: this.id,
        aggregateType: 'Unit',
        payload: {
          unitId: this.id,
          professionalProfileId,
        },
      });
    }
  }

  isDeleted(): boolean {
    return this.props.deletedAt !== undefined;
  }
}
