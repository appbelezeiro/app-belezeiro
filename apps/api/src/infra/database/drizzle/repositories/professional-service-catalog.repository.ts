import { eq, and } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IProfessionalServiceRepository } from '../../../../contracts/repositories/professional-service.repository';
import { ProfessionalService } from '../../../../domain/catalog/professional-catalog/professional-service.entity';
import { professionalServicesTable } from '../schemas/professional-services.schema';
import { ProfessionalServiceCatalogMapper } from '../mappers/professional-service-catalog.mapper';

export class ProfessionalServiceCatalogRepository implements IProfessionalServiceRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async create(professionalService: ProfessionalService): Promise<ProfessionalService> {
    const insert = ProfessionalServiceCatalogMapper.toPersistence(professionalService);

    await this.db.insert(professionalServicesTable).values(insert);

    return professionalService;
  }

  async findById(id: string): Promise<ProfessionalService | null> {
    const [row] = await this.db
      .select()
      .from(professionalServicesTable)
      .where(eq(professionalServicesTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return ProfessionalServiceCatalogMapper.toDomain(row);
  }

  async findByProfessionalId(professionalProfileId: string): Promise<ProfessionalService[]> {
    const rows = await this.db
      .select()
      .from(professionalServicesTable)
      .where(eq(professionalServicesTable.professionalProfileId, professionalProfileId));

    return rows.map((row) => ProfessionalServiceCatalogMapper.toDomain(row));
  }

  async findByProfessionalAndService(
    professionalProfileId: string,
    serviceId: string,
  ): Promise<ProfessionalService | null> {
    const [row] = await this.db
      .select()
      .from(professionalServicesTable)
      .where(
        and(
          eq(professionalServicesTable.professionalProfileId, professionalProfileId),
          eq(professionalServicesTable.serviceId, serviceId),
        ),
      )
      .limit(1);

    if (!row) {
      return null;
    }

    return ProfessionalServiceCatalogMapper.toDomain(row);
  }

  async update(professionalService: ProfessionalService): Promise<ProfessionalService> {
    const insert = ProfessionalServiceCatalogMapper.toPersistence(professionalService);

    await this.db
      .update(professionalServicesTable)
      .set({
        customPrice: insert.customPrice,
        customDuration: insert.customDuration,
        isActive: insert.isActive,
        updatedAt: insert.updatedAt,
      })
      .where(eq(professionalServicesTable.id, professionalService.id));

    return professionalService;
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(professionalServicesTable)
      .where(eq(professionalServicesTable.id, id));
  }
}
