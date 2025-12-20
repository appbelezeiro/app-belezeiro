import { eq, inArray } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IUnitProfessionalServiceRepository } from '../../../../contracts/repositories/unit-professional-service.repository';
import { UnitProfessionalService } from '../../../../domain/catalog/unit-professional-service/unit-professional-service.entity';
import { unitProfessionalServicesTable } from '../schemas/unit-professional-services.schema';
import { unitProfessionalLinksTable } from '../schemas/unit-professional-links.schema';
import { UnitProfessionalServiceMapper } from '../mappers/unit-professional-service.mapper';

export class UnitProfessionalServiceRepository implements IUnitProfessionalServiceRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async create(unitProfessionalService: UnitProfessionalService): Promise<UnitProfessionalService> {
    const insert = UnitProfessionalServiceMapper.toPersistence(unitProfessionalService);

    await this.db.insert(unitProfessionalServicesTable).values(insert);

    return unitProfessionalService;
  }

  async findById(id: string): Promise<UnitProfessionalService | null> {
    const [row] = await this.db
      .select()
      .from(unitProfessionalServicesTable)
      .where(eq(unitProfessionalServicesTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return UnitProfessionalServiceMapper.toDomain(row);
  }

  async findByUnitProfessionalLinkId(
    unitProfessionalLinkId: string,
  ): Promise<UnitProfessionalService[]> {
    const rows = await this.db
      .select()
      .from(unitProfessionalServicesTable)
      .where(eq(unitProfessionalServicesTable.unitProfessionalLinkId, unitProfessionalLinkId));

    return rows.map((row) => UnitProfessionalServiceMapper.toDomain(row));
  }

  async findByUnitId(unitId: string): Promise<UnitProfessionalService[]> {
    const unitProfessionalLinks = await this.db
      .select()
      .from(unitProfessionalLinksTable)
      .where(eq(unitProfessionalLinksTable.unitId, unitId));

    if (unitProfessionalLinks.length === 0) {
      return [];
    }

    const linkIds = unitProfessionalLinks.map((link) => link.id);

    const rows = await this.db
      .select()
      .from(unitProfessionalServicesTable)
      .where(inArray(unitProfessionalServicesTable.unitProfessionalLinkId, linkIds));

    return rows.map((row) => UnitProfessionalServiceMapper.toDomain(row));
  }

  async update(unitProfessionalService: UnitProfessionalService): Promise<UnitProfessionalService> {
    const insert = UnitProfessionalServiceMapper.toPersistence(unitProfessionalService);

    await this.db
      .update(unitProfessionalServicesTable)
      .set({
        unitPrice: insert.unitPrice,
        unitDuration: insert.unitDuration,
        isActive: insert.isActive,
        updatedAt: insert.updatedAt,
      })
      .where(eq(unitProfessionalServicesTable.id, unitProfessionalService.id));

    return unitProfessionalService;
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(unitProfessionalServicesTable)
      .where(eq(unitProfessionalServicesTable.id, id));
  }
}
