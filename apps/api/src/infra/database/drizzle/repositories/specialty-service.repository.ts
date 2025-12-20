import { eq, and } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { SpecialtyService } from '../../../../domain/catalog/specialty/specialty-service.entity';
import { specialtyServicesTable } from '../schemas/specialty-services.schema';
import { SpecialtyServiceMapper } from '../mappers/specialty-service.mapper';

export class SpecialtyServiceRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async create(specialtyService: SpecialtyService): Promise<void> {
    const insert = SpecialtyServiceMapper.toPersistence(specialtyService);

    await this.db.insert(specialtyServicesTable).values(insert);
  }

  async delete(specialtyId: string, serviceId: string): Promise<void> {
    await this.db
      .delete(specialtyServicesTable)
      .where(
        and(
          eq(specialtyServicesTable.specialtyId, specialtyId),
          eq(specialtyServicesTable.serviceId, serviceId),
        ),
      );
  }

  async exists(specialtyId: string, serviceId: string): Promise<boolean> {
    const [result] = await this.db
      .select()
      .from(specialtyServicesTable)
      .where(
        and(
          eq(specialtyServicesTable.specialtyId, specialtyId),
          eq(specialtyServicesTable.serviceId, serviceId),
        ),
      )
      .limit(1);

    return !!result;
  }

  async findBySpecialtyId(specialtyId: string): Promise<SpecialtyService[]> {
    const rows = await this.db
      .select()
      .from(specialtyServicesTable)
      .where(eq(specialtyServicesTable.specialtyId, specialtyId));

    return rows.map((row) => SpecialtyServiceMapper.toDomain(row));
  }

  async findByServiceId(serviceId: string): Promise<SpecialtyService[]> {
    const rows = await this.db
      .select()
      .from(specialtyServicesTable)
      .where(eq(specialtyServicesTable.serviceId, serviceId));

    return rows.map((row) => SpecialtyServiceMapper.toDomain(row));
  }
}
