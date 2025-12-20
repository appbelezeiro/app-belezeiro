import { Specialty } from '../../../../domain/catalog/specialty/specialty.aggregate';
import {
  SpecialtyRow,
  SpecialtyInsert,
} from '../schemas/specialties.schema';

export class SpecialtyMapper {
  static toPersistence(specialty: Specialty): SpecialtyInsert {
    return {
      id: specialty.id,
      name: specialty.name,
      description: specialty.description ?? null,
      icon: specialty.icon ?? null,
      isGlobal: specialty.isGlobal,
      ownerId: specialty.ownerId ?? null,
      createdAt: specialty.createdAt,
      updatedAt: specialty.updatedAt,
    };
  }

  static toDomain(row: SpecialtyRow): Specialty {
    return Specialty.reconstitute({
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      icon: row.icon ?? undefined,
      isGlobal: row.isGlobal,
      ownerId: row.ownerId ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
