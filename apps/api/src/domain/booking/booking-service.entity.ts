import { BaseEntity, BaseEntityProps } from '../entities/base/base-entity';

export interface BookingServiceProps extends BaseEntityProps {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  duration: number;
  order: number;
}

export class BookingService extends BaseEntity<BookingServiceProps> {
  protected prefix(): string {
    return 'bsvc';
  }

  private constructor(props: BookingServiceProps) {
    super(props);
  }

  static create(data: {
    bookingId: string;
    serviceId: string;
    serviceName: string;
    duration: number;
    order: number;
  }): BookingService {
    return new BookingService({
      bookingId: data.bookingId,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      duration: data.duration,
      order: data.order,
    });
  }

  static reconstitute(data: {
    id: string;
    bookingId: string;
    serviceId: string;
    serviceName: string;
    duration: number;
    order: number;
    createdAt: Date;
  }): BookingService {
    return new BookingService({
      id: data.id,
      bookingId: data.bookingId,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      duration: data.duration,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.createdAt,
    });
  }

  get bookingId(): string {
    return this.props.bookingId;
  }

  get serviceId(): string {
    return this.props.serviceId;
  }

  get serviceName(): string {
    return this.props.serviceName;
  }

  get duration(): number {
    return this.props.duration;
  }

  get order(): number {
    return this.props.order;
  }
}
