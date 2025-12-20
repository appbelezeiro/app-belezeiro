import { Booking } from '../../../../domain/booking/booking.aggregate';
import { BookingService } from '../../../../domain/booking/booking-service.entity';
import { BookingStatus } from '../../../../domain/booking/value-objects/booking-status.vo';
import {
  BookingRow,
  BookingInsert,
} from '../schemas/bookings.schema';

export class BookingMapper {
  static toPersistence(booking: Booking): {
    booking: BookingInsert;
  } {
    return {
      booking: {
        id: booking.id,
        professionalProfileId: booking.professionalProfileId,
        customerProfileId: booking.customerProfileId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalDuration: booking.totalDuration,
        status: booking.status,
        cancelledBy: booking.cancelledBy ?? null,
        cancellationReason: booking.cancellationReason ?? null,
        cancelledAt: booking.cancelledAt ?? null,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      },
    };
  }

  static toDomain(row: BookingRow, services: BookingService[]): Booking {
    return Booking.reconstitute({
      id: row.id,
      professionalProfileId: row.professionalProfileId,
      customerProfileId: row.customerProfileId,
      startTime: row.startTime,
      endTime: row.endTime,
      totalDuration: row.totalDuration,
      status: row.status as BookingStatus,
      cancelledBy: row.cancelledBy as 'customer' | 'professional' | undefined,
      cancellationReason: row.cancellationReason ?? undefined,
      cancelledAt: row.cancelledAt ?? undefined,
      services,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
