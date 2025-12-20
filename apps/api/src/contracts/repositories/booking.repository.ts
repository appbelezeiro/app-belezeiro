import { Booking } from '../../domain/booking/booking.aggregate';

export interface BookingFilters {
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IBookingRepository {
  findById(id: string): Promise<Booking | null>;
  findByProfessional(
    professionalProfileId: string,
    filters?: BookingFilters
  ): Promise<Booking[]>;
  findByCustomer(
    customerProfileId: string,
    filters?: BookingFilters
  ): Promise<Booking[]>;
  hasConflict(
    professionalProfileId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<boolean>;
  save(booking: Booking): Promise<void>;
}
