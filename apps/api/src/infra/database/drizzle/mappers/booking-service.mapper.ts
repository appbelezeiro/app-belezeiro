import { BookingService } from '../../../../domain/booking/booking-service.entity';
import {
  BookingServiceRow,
  BookingServiceInsert,
} from '../schemas/booking-services.schema';

export class BookingServiceMapper {
  static toPersistence(service: BookingService): BookingServiceInsert {
    return {
      id: service.id,
      bookingId: service.bookingId,
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      duration: service.duration,
      order: service.order,
      createdAt: service.createdAt,
    };
  }

  static toDomain(row: BookingServiceRow): BookingService {
    return BookingService.reconstitute({
      id: row.id,
      bookingId: row.bookingId,
      serviceId: row.serviceId,
      serviceName: row.serviceName,
      duration: row.duration,
      order: row.order,
      createdAt: row.createdAt,
    });
  }
}
