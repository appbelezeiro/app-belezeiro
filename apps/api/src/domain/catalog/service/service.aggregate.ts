import { AggregateRoot, BaseEntityProps } from '../../entities/base/aggregate-root';
import { ServiceEvents } from './service.events';

export interface ServiceProps extends BaseEntityProps {
  name: string;
  description?: string;
  defaultDuration?: number;
  isGlobal: boolean;
  ownerId?: string;
  createdById?: string;
}

export class Service extends AggregateRoot<ServiceProps> {
  get aggregateType(): string {
    return 'Service';
  }

  protected prefix(): string {
    return 'svc';
  }

  private constructor(props: ServiceProps) {
    super(props);
    this.validate();
  }

  private validate(): void {
    if (this.props.isGlobal && this.props.ownerId) {
      throw new Error('Global service cannot have ownerId');
    }

    if (!this.props.isGlobal && !this.props.ownerId) {
      throw new Error('Custom service must have ownerId');
    }
  }

  static createGlobal(data: {
    name: string;
    description?: string;
    defaultDuration?: number;
  }): Service {
    const service = new Service({
      name: data.name,
      description: data.description,
      defaultDuration: data.defaultDuration,
      isGlobal: true,
      ownerId: undefined,
      createdById: undefined,
    });

    service.raise({
      eventType: ServiceEvents.ServiceCreated,
      aggregateId: service.id,
      aggregateType: 'Service',
      payload: {
        serviceId: service.id,
        name: data.name,
        isGlobal: true,
      },
    });

    return service;
  }

  static createCustomForProfessional(data: {
    professionalProfileId: string;
    name: string;
    description?: string;
    defaultDuration?: number;
  }): Service {
    const service = new Service({
      name: data.name,
      description: data.description,
      defaultDuration: data.defaultDuration,
      isGlobal: false,
      ownerId: data.professionalProfileId,
      createdById: data.professionalProfileId,
    });

    service.raise({
      eventType: ServiceEvents.ServiceCreated,
      aggregateId: service.id,
      aggregateType: 'Service',
      payload: {
        serviceId: service.id,
        name: data.name,
        isGlobal: false,
        ownerId: data.professionalProfileId,
      },
    });

    return service;
  }

  static reconstitute(data: {
    id: string;
    name: string;
    description?: string;
    defaultDuration?: number;
    isGlobal: boolean;
    ownerId?: string;
    createdById?: string;
    createdAt: Date;
    updatedAt: Date;
  }): Service {
    return new Service({
      id: data.id,
      name: data.name,
      description: data.description,
      defaultDuration: data.defaultDuration,
      isGlobal: data.isGlobal,
      ownerId: data.ownerId,
      createdById: data.createdById,
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

  get defaultDuration(): number | undefined {
    return this.props.defaultDuration;
  }

  get isGlobal(): boolean {
    return this.props.isGlobal;
  }

  get ownerId(): string | undefined {
    return this.props.ownerId;
  }

  get createdById(): string | undefined {
    return this.props.createdById;
  }

  update(data: {
    name?: string;
    description?: string;
    defaultDuration?: number;
  }): void {
    const changedFields: string[] = [];

    if (data.name !== undefined && data.name !== this.props.name) {
      this.props.name = data.name;
      changedFields.push('name');
    }

    if (data.description !== undefined && data.description !== this.props.description) {
      this.props.description = data.description;
      changedFields.push('description');
    }

    if (data.defaultDuration !== undefined && data.defaultDuration !== this.props.defaultDuration) {
      this.props.defaultDuration = data.defaultDuration;
      changedFields.push('defaultDuration');
    }

    if (changedFields.length > 0) {
      this.touch();

      this.raise({
        eventType: ServiceEvents.ServiceUpdated,
        aggregateId: this.id,
        aggregateType: 'Service',
        payload: {
          serviceId: this.id,
          changedFields,
        },
      });
    }
  }
}
