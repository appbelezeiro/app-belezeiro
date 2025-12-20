import { eq, and } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IAvailabilityRepository } from '../../../../contracts/repositories/availability.repository';
import { Availability } from '../../../../domain/booking/availability.entity';
import { availabilitiesTable } from '../schemas/availabilities.schema';
import { AvailabilityMapper } from '../mappers/availability.mapper';

export class AvailabilityRepository implements IAvailabilityRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async findById(id: string): Promise<Availability | null> {
    const [row] = await this.db
      .select()
      .from(availabilitiesTable)
      .where(eq(availabilitiesTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return AvailabilityMapper.toDomain(row);
  }

  async findByProfessional(professionalProfileId: string): Promise<Availability[]> {
    const rows = await this.db
      .select()
      .from(availabilitiesTable)
      .where(eq(availabilitiesTable.professionalProfileId, professionalProfileId));

    return rows.map((row) => AvailabilityMapper.toDomain(row));
  }

  async findByProfessionalAndDay(
    professionalProfileId: string,
    dayOfWeek: number
  ): Promise<Availability | null> {
    const [row] = await this.db
      .select()
      .from(availabilitiesTable)
      .where(
        and(
          eq(availabilitiesTable.professionalProfileId, professionalProfileId),
          eq(availabilitiesTable.dayOfWeek, dayOfWeek)
        )
      )
      .limit(1);

    if (!row) {
      return null;
    }

    return AvailabilityMapper.toDomain(row);
  }

  async upsert(availability: Availability): Promise<void> {
    const insert = AvailabilityMapper.toPersistence(availability);

    await this.db
      .insert(availabilitiesTable)
      .values(insert)
      .onConflictDoUpdate({
        target: [
          availabilitiesTable.professionalProfileId,
          availabilitiesTable.dayOfWeek,
        ],
        set: {
          startTime: insert.startTime,
          endTime: insert.endTime,
          isActive: insert.isActive,
          updatedAt: insert.updatedAt,
        },
      });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(availabilitiesTable).where(eq(availabilitiesTable.id, id));
  }
}
