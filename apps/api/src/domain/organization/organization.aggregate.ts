import { AggregateRoot, BaseEntityProps } from '../entities/base/aggregate-root';
import { OrganizationEvents } from './organization.events';

export interface OrganizationProps extends BaseEntityProps {
  ownerId: string;
  name: string;
  slug: string;
  document?: string;
  logo?: string;
  description?: string;
  category?: string;
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
    ownerId: string;
    name: string;
    slug: string;
    document?: string;
    logo?: string;
    description?: string;
    category?: string;
  }): Organization {
    const organization = new Organization({
      ownerId: data.ownerId,
      name: data.name,
      slug: data.slug,
      document: data.document,
      logo: data.logo,
      description: data.description,
      category: data.category,
    });

    organization.raise({
      eventType: OrganizationEvents.OrganizationCreated,
      aggregateId: organization.id,
      aggregateType: 'Organization',
      payload: {
        organizationId: organization.id,
        ownerId: data.ownerId,
        name: data.name,
        slug: data.slug,
      },
    });

    return organization;
  }

  static reconstitute(data: {
    id: string;
    ownerId: string;
    name: string;
    slug: string;
    document?: string;
    logo?: string;
    description?: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }): Organization {
    return new Organization({
      id: data.id,
      ownerId: data.ownerId,
      name: data.name,
      slug: data.slug,
      document: data.document,
      logo: data.logo,
      description: data.description,
      category: data.category,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get document(): string | undefined {
    return this.props.document;
  }

  get logo(): string | undefined {
    return this.props.logo;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get category(): string | undefined {
    return this.props.category;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  update(data: {
    name?: string;
    slug?: string;
    document?: string;
    logo?: string;
    description?: string;
    category?: string;
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

    if (data.document !== undefined && data.document !== this.props.document) {
      this.props.document = data.document;
      changedFields.push('document');
    }

    if (data.logo !== undefined && data.logo !== this.props.logo) {
      this.props.logo = data.logo;
      changedFields.push('logo');
    }

    if (data.description !== undefined && data.description !== this.props.description) {
      this.props.description = data.description;
      changedFields.push('description');
    }

    if (data.category !== undefined && data.category !== this.props.category) {
      this.props.category = data.category;
      changedFields.push('category');
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

  canDelete(hasActiveUnits: boolean): boolean {
    return !hasActiveUnits;
  }

  isDeleted(): boolean {
    return this.props.deletedAt !== undefined;
  }
}
