import { eq, inArray } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ISpecialtyRepository } from '../../../../contracts/repositories/specialty.repository';
import { Specialty } from '../../../../domain/catalog/specialty/specialty.aggregate';
import { specialtiesTable } from '../schemas/specialties.schema';
import { professionalSpecialtiesTable } from '../schemas/professional-specialties.schema';
import { SpecialtyMapper } from '../mappers/specialty.mapper';

export class SpecialtyRepository implements ISpecialtyRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async create(specialty: Specialty): Promise<Specialty> {
    const specialtyInsert = SpecialtyMapper.toPersistence(specialty);

    await this.db.insert(specialtiesTable).values(specialtyInsert);

    return specialty;
  }

  async findById(id: string): Promise<Specialty | null> {
    const [row] = await this.db
      .select()
      .from(specialtiesTable)
      .where(eq(specialtiesTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return SpecialtyMapper.toDomain(row);
  }

  async findGlobal(): Promise<Specialty[]> {
    const rows = await this.db
      .select()
      .from(specialtiesTable)
      .where(eq(specialtiesTable.isGlobal, true));

    return rows.map((row) => SpecialtyMapper.toDomain(row));
  }

  async findByProfessionalId(professionalProfileId: string): Promise<Specialty[]> {
    const professionalSpecialtyRows = await this.db
      .select()
      .from(professionalSpecialtiesTable)
      .where(eq(professionalSpecialtiesTable.professionalProfileId, professionalProfileId));

    if (professionalSpecialtyRows.length === 0) {
      return [];
    }

    const specialtyIds = professionalSpecialtyRows.map((row) => row.specialtyId);

    const rows = await this.db
      .select()
      .from(specialtiesTable)
      .where(inArray(specialtiesTable.id, specialtyIds));

    return rows.map((row) => SpecialtyMapper.toDomain(row));
  }

  async update(specialty: Specialty): Promise<Specialty> {
    const specialtyInsert = SpecialtyMapper.toPersistence(specialty);

    await this.db
      .update(specialtiesTable)
      .set({
        name: specialtyInsert.name,
        description: specialtyInsert.description,
        icon: specialtyInsert.icon,
        updatedAt: specialtyInsert.updatedAt,
      })
      .where(eq(specialtiesTable.id, specialty.id));

    return specialty;
  }
}
