import { Availability } from '../../../../domain/booking/availability.entity';
import {
  AvailabilityRow,
  AvailabilityInsert,
} from '../schemas/availabilities.schema';

export class AvailabilityMapper {
  static toPersistence(availability: Availability): AvailabilityInsert {
    return {
      id: availability.id,
      professionalProfileId: availability.professionalProfileId,
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime,
      endTime: availability.endTime,
      isActive: availability.isActive,
      createdAt: availability.createdAt,
      updatedAt: availability.updatedAt,
    };
  }

  static toDomain(row: AvailabilityRow): Availability {
    return Availability.reconstitute({
      id: row.id,
      professionalProfileId: row.professionalProfileId,
      dayOfWeek: row.dayOfWeek,
      startTime: row.startTime,
      endTime: row.endTime,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
