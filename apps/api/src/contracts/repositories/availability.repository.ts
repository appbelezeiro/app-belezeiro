import { Availability } from '../../domain/booking/availability.entity';

export interface IAvailabilityRepository {
  findById(id: string): Promise<Availability | null>;
  findByProfessional(professionalProfileId: string): Promise<Availability[]>;
  findByProfessionalAndDay(
    professionalProfileId: string,
    dayOfWeek: number
  ): Promise<Availability | null>;
  upsert(availability: Availability): Promise<void>;
  delete(id: string): Promise<void>;
}
