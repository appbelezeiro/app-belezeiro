import { AggregateRoot, BaseEntityProps } from '../entities/base/aggregate-root';
import { OrganizationEvents } from './organization.events';

export interface OrganizationProps extends BaseEntityProps {
  userId: string;
  name: string;
  slug: string;
  description?: string;
  photoUrl?: string;
  address?: string;
  phone?: string;
  deletedAt?: Date;
}

export class Organization extends AggregateRoot<OrganizationProps> {
  get aggregateType(): string {
    return 'Organization';
  }

  protected prefix(): string {
    return 'org';
  }

  private constructor(props: OrganizationProps) {
    super(props);
  }

  static create(data: {
    userId: string;
    name: string;
    slug: string;
    description?: string;
    photoUrl?: string;
    address?: string;
    phone?: string;
  }): Organization {
    const organization = new Organization({
      userId: data.userId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      photoUrl: data.photoUrl,
      address: data.address,
      phone: data.phone,
    });

    organization.raise({
      eventType: OrganizationEvents.OrganizationCreated,
      aggregateId: organization.id,
      aggregateType: 'Organization',
      payload: {
        organizationId: organization.id,
        userId: data.userId,
        name: data.name,
        slug: data.slug,
      },
    });

    return organization;
  }

  static reconstitute(data: {
    id: string;
    userId: string;
    name: string;
    slug: string;
    description?: string;
    photoUrl?: string;
    address?: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }): Organization {
    return new Organization({
      id: data.id,
      userId: data.userId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      photoUrl: data.photoUrl,
      address: data.address,
      phone: data.phone,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get photoUrl(): string | undefined {
    return this.props.photoUrl;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  update(data: {
    name?: string;
    slug?: string;
    description?: string;
    photoUrl?: string;
    address?: string;
    phone?: string;
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

    if (data.description !== undefined && data.description !== this.props.description) {
      this.props.description = data.description;
      changedFields.push('description');
    }

    if (data.photoUrl !== undefined && data.photoUrl !== this.props.photoUrl) {
      this.props.photoUrl = data.photoUrl;
      changedFields.push('photoUrl');
    }

    if (data.address !== undefined && data.address !== this.props.address) {
      this.props.address = data.address;
      changedFields.push('address');
    }

    if (data.phone !== undefined && data.phone !== this.props.phone) {
      this.props.phone = data.phone;
      changedFields.push('phone');
    }

    if (changedFields.length > 0) {
      this.touch();

      this.raise({
        eventType: OrganizationEvents.OrganizationUpdated,
        aggregateId: this.id,
        aggregateType: 'Organization',
        payload: {
          organizationId: this.id,
          changedFields,
        },
      });
    }
  }

  softDelete(): void {
    this.props.deletedAt = new Date();
    this.touch();

    this.raise({
      eventType: OrganizationEvents.OrganizationDeleted,
      aggregateId: this.id,
      aggregateType: 'Organization',
      payload: {
        organizationId: this.id,
        deletedAt: this.props.deletedAt,
      },
    });
  }

  isDeleted(): boolean {
    return this.props.deletedAt !== undefined;
  }
}
