import { eq, and } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IProfessionalSpecialtyRepository } from '../../../../contracts/repositories/professional-specialty.repository';
import { ProfessionalSpecialty } from '../../../../domain/catalog/professional-catalog/professional-specialty.entity';
import { professionalSpecialtiesTable } from '../schemas/professional-specialties.schema';
import { ProfessionalSpecialtyMapper } from '../mappers/professional-specialty.mapper';

export class ProfessionalSpecialtyRepository implements IProfessionalSpecialtyRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async create(professionalSpecialty: ProfessionalSpecialty): Promise<ProfessionalSpecialty> {
    const insert = ProfessionalSpecialtyMapper.toPersistence(professionalSpecialty);

    await this.db.insert(professionalSpecialtiesTable).values(insert);

    return professionalSpecialty;
  }

  async findByProfessionalId(professionalProfileId: string): Promise<ProfessionalSpecialty[]> {
    const rows = await this.db
      .select()
      .from(professionalSpecialtiesTable)
      .where(eq(professionalSpecialtiesTable.professionalProfileId, professionalProfileId));

    return rows.map((row) => ProfessionalSpecialtyMapper.toDomain(row));
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(professionalSpecialtiesTable)
      .where(eq(professionalSpecialtiesTable.id, id));
  }

  async exists(professionalProfileId: string, specialtyId: string): Promise<boolean> {
    const [result] = await this.db
      .select()
      .from(professionalSpecialtiesTable)
      .where(
        and(
          eq(professionalSpecialtiesTable.professionalProfileId, professionalProfileId),
          eq(professionalSpecialtiesTable.specialtyId, specialtyId),
        ),
      )
      .limit(1);

    return !!result;
  }
}
