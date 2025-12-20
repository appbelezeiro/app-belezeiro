import { Unit } from '../../../../domain/organization/unit/unit.aggregate';
import { UnitAddress } from '../../../../domain/organization/unit/unit-address.entity';
import { UnitRow, UnitInsert } from '../schemas/units.schema';

export class UnitMapper {
  static toPersistence(unit: Unit): { unit: UnitInsert } {
    return {
      unit: {
        id: unit.id,
        organizationId: unit.organizationId,
        name: unit.name,
        slug: unit.slug,
        isSoloProfessional: unit.isSoloProfessional,
        phone: unit.phone ?? null,
        email: unit.email ?? null,
        createdAt: unit.createdAt,
        updatedAt: unit.updatedAt,
        deletedAt: unit.deletedAt ?? null,
      },
    };
  }

  static toDomain(row: UnitRow, address?: UnitAddress): Unit {
    return Unit.reconstitute({
      id: row.id,
      organizationId: row.organizationId,
      name: row.name,
      slug: row.slug,
      isSoloProfessional: row.isSoloProfessional,
      phone: row.phone ?? undefined,
      email: row.email ?? undefined,
      address,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    });
  }
}
