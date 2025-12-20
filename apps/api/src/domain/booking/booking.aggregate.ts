import { AggregateRoot, BaseEntityProps } from '../entities/base/aggregate-root';
import { BookingService } from './booking-service.entity';
import { BookingEvents } from './booking.events';
import { BookingStatus, BookingStatusVO } from './value-objects/booking-status.vo';
import { CancellationReason } from './value-objects/cancellation-reason.vo';
import { InvalidBookingStatusError } from './errors/invalid-booking-status.error';

export interface BookingProps extends BaseEntityProps {
  professionalProfileId: string;
  customerProfileId: string;
  status: BookingStatus;
  startTime: Date;
  endTime: Date;
  totalDuration: number;
  cancellationReason?: string;
  cancelledBy?: 'customer' | 'professional';
  cancelledAt?: Date;
  services: BookingService[];
}

export class Booking extends AggregateRoot<BookingProps> {
  get aggregateType(): string {
    return 'Booking';
  }

  protected prefix(): string {
    return 'book';
  }

  private constructor(props: BookingProps) {
    super(props);
  }

  static create(data: {
    professionalProfileId: string;
    customerProfileId: string;
    startTime: Date;
    endTime: Date;
    totalDuration: number;
    services: Array<{
      serviceId: string;
      serviceName: string;
      duration: number;
      order: number;
    }>;
  }): Booking {
    const booking = new Booking({
      professionalProfileId: data.professionalProfileId,
      customerProfileId: data.customerProfileId,
      status: BookingStatus.Confirmed,
      startTime: data.startTime,
      endTime: data.endTime,
      totalDuration: data.totalDuration,
      services: data.services.map((s) =>
        BookingService.create({
          bookingId: '',
          serviceId: s.serviceId,
          serviceName: s.serviceName,
          duration: s.duration,
          order: s.order,
        })
      ),
    });

    // Update bookingId for services after booking is created
    booking.props.services.forEach((service) => {
      (service as any).props.bookingId = booking.id;
    });

    booking.raise({
      eventType: BookingEvents.BookingCreated,
      aggregateId: booking.id,
      aggregateType: 'Booking',
      payload: {
        bookingId: booking.id,
        professionalProfileId: data.professionalProfileId,
        customerProfileId: data.customerProfileId,
        startTime: data.startTime,
        services: data.services,
      },
    });

    return booking;
  }

  static reconstitute(data: {
    id: string;
    professionalProfileId: string;
    customerProfileId: string;
    status: BookingStatus;
    startTime: Date;
    endTime: Date;
    totalDuration: number;
    cancellationReason?: string;
    cancelledBy?: 'customer' | 'professional';
    cancelledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    services: BookingService[];
  }): Booking {
    return new Booking({
      id: data.id,
      professionalProfileId: data.professionalProfileId,
      customerProfileId: data.customerProfileId,
      status: data.status,
      startTime: data.startTime,
      endTime: data.endTime,
      totalDuration: data.totalDuration,
      cancellationReason: data.cancellationReason,
      cancelledBy: data.cancelledBy,
      cancelledAt: data.cancelledAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      services: data.services,
    });
  }

  get professionalProfileId(): string {
    return this.props.professionalProfileId;
  }

  get customerProfileId(): string {
    return this.props.customerProfileId;
  }

  get status(): BookingStatus {
    return this.props.status;
  }

  get startTime(): Date {
    return this.props.startTime;
  }

  get endTime(): Date {
    return this.props.endTime;
  }

  get totalDuration(): number {
    return this.props.totalDuration;
  }

  get cancellationReason(): string | undefined {
    return this.props.cancellationReason;
  }

  get cancelledBy(): 'customer' | 'professional' | undefined {
    return this.props.cancelledBy;
  }

  get cancelledAt(): Date | undefined {
    return this.props.cancelledAt;
  }

  get services(): BookingService[] {
    return this.props.services;
  }

  cancel(cancelledBy: 'customer' | 'professional', reason: string): void {
    if (!this.canCancel()) {
      throw new InvalidBookingStatusError('Booking cannot be cancelled in current status');
    }

    const cancellationReason = new CancellationReason(reason);

    this.props.status = BookingStatus.Cancelled;
    this.props.cancelledBy = cancelledBy;
    this.props.cancellationReason = cancellationReason.getValue();
    this.props.cancelledAt = new Date();
    this.touch();

    this.raise({
      eventType: BookingEvents.BookingCancelled,
      aggregateId: this.id,
      aggregateType: 'Booking',
      payload: {
        bookingId: this.id,
        cancelledBy,
        cancellationReason: cancellationReason.getValue(),
        cancelledAt: this.props.cancelledAt,
      },
    });
  }

  complete(): void {
    if (!this.canComplete()) {
      throw new InvalidBookingStatusError('Booking cannot be completed in current status');
    }

    this.props.status = BookingStatus.Completed;
    this.touch();

    this.raise({
      eventType: BookingEvents.BookingCompleted,
      aggregateId: this.id,
      aggregateType: 'Booking',
      payload: {
        bookingId: this.id,
        completedAt: new Date(),
      },
    });
  }

  canCancel(): boolean {
    return this.props.status === BookingStatus.Confirmed;
  }

  canComplete(): boolean {
    return this.props.status === BookingStatus.Confirmed;
  }
}
