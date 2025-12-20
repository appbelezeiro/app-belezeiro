import { eq, and, gte, lte, ne, lt, gt } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  IBookingRepository,
  BookingFilters,
} from '../../../../contracts/repositories/booking.repository';
import { Booking } from '../../../../domain/booking/booking.aggregate';
import { bookingsTable } from '../schemas/bookings.schema';
import { bookingServicesTable } from '../schemas/booking-services.schema';
import { BookingMapper } from '../mappers/booking.mapper';
import { BookingServiceMapper } from '../mappers/booking-service.mapper';

export class BookingRepository implements IBookingRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async findById(id: string): Promise<Booking | null> {
    const [bookingRow] = await this.db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.id, id))
      .limit(1);

    if (!bookingRow) {
      return null;
    }

    const serviceRows = await this.db
      .select()
      .from(bookingServicesTable)
      .where(eq(bookingServicesTable.bookingId, id))
      .orderBy(bookingServicesTable.order);

    const services = serviceRows.map((row) => BookingServiceMapper.toDomain(row));

    return BookingMapper.toDomain(bookingRow, services);
  }

  async findByProfessional(
    professionalProfileId: string,
    filters?: BookingFilters
  ): Promise<Booking[]> {
    let query = this.db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.professionalProfileId, professionalProfileId))
      .$dynamic();

    if (filters?.status) {
      query = query.where(eq(bookingsTable.status, filters.status));
    }

    if (filters?.startDate) {
      query = query.where(gte(bookingsTable.startTime, filters.startDate));
    }

    if (filters?.endDate) {
      query = query.where(lte(bookingsTable.startTime, filters.endDate));
    }

    const bookingRows = await query;

    const bookings = await Promise.all(
      bookingRows.map(async (bookingRow) => {
        const serviceRows = await this.db
          .select()
          .from(bookingServicesTable)
          .where(eq(bookingServicesTable.bookingId, bookingRow.id))
          .orderBy(bookingServicesTable.order);

        const services = serviceRows.map((row) => BookingServiceMapper.toDomain(row));

        return BookingMapper.toDomain(bookingRow, services);
      })
    );

    return bookings;
  }

  async findByCustomer(
    customerProfileId: string,
    filters?: BookingFilters
  ): Promise<Booking[]> {
    let query = this.db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.customerProfileId, customerProfileId))
      .$dynamic();

    if (filters?.status) {
      query = query.where(eq(bookingsTable.status, filters.status));
    }

    if (filters?.startDate) {
      query = query.where(gte(bookingsTable.startTime, filters.startDate));
    }

    if (filters?.endDate) {
      query = query.where(lte(bookingsTable.startTime, filters.endDate));
    }

    const bookingRows = await query;

    const bookings = await Promise.all(
      bookingRows.map(async (bookingRow) => {
        const serviceRows = await this.db
          .select()
          .from(bookingServicesTable)
          .where(eq(bookingServicesTable.bookingId, bookingRow.id))
          .orderBy(bookingServicesTable.order);

        const services = serviceRows.map((row) => BookingServiceMapper.toDomain(row));

        return BookingMapper.toDomain(bookingRow, services);
      })
    );

    return bookings;
  }

  async hasConflict(
    professionalProfileId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<boolean> {
    const conditions = [
      eq(bookingsTable.professionalProfileId, professionalProfileId),
      eq(bookingsTable.status, 'confirmed'),
      lt(bookingsTable.startTime, endTime),
      gt(bookingsTable.endTime, startTime),
    ];

    if (excludeBookingId) {
      conditions.push(ne(bookingsTable.id, excludeBookingId));
    }

    const [result] = await this.db
      .select()
      .from(bookingsTable)
      .where(and(...conditions))
      .limit(1);

    return !!result;
  }

  async save(booking: Booking): Promise<void> {
    const { booking: bookingInsert } = BookingMapper.toPersistence(booking);

    await this.db.transaction(async (tx) => {
      await tx
        .insert(bookingsTable)
        .values(bookingInsert)
        .onConflictDoUpdate({
          target: bookingsTable.id,
          set: {
            status: bookingInsert.status,
            cancelledBy: bookingInsert.cancelledBy,
            cancellationReason: bookingInsert.cancellationReason,
            cancelledAt: bookingInsert.cancelledAt,
            updatedAt: bookingInsert.updatedAt,
          },
        });

      await tx
        .delete(bookingServicesTable)
        .where(eq(bookingServicesTable.bookingId, booking.id));

      if (booking.services.length > 0) {
        const servicesInsert = booking.services.map((service) =>
          BookingServiceMapper.toPersistence(service)
        );

        await tx.insert(bookingServicesTable).values(servicesInsert);
      }
    });
  }
}
