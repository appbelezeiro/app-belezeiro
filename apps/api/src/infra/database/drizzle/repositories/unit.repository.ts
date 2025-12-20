import { eq, and, isNull } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IUnitRepository } from '../../../../contracts/repositories/unit.repository';
import { Unit } from '../../../../domain/organization/unit/unit.aggregate';
import { unitsTable } from '../schemas/units.schema';
import { unitAddressesTable } from '../schemas/unit-addresses.schema';
import { UnitMapper } from '../mappers/unit.mapper';
import { UnitAddressMapper } from '../mappers/unit-address.mapper';

export class UnitRepository implements IUnitRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async create(unit: Unit): Promise<Unit> {
    const { unit: unitInsert } = UnitMapper.toPersistence(unit);

    await this.db.transaction(async (tx) => {
      await tx.insert(unitsTable).values(unitInsert);

      if (unit.address) {
        const addressInsert = UnitAddressMapper.toPersistence(unit.address);
        await tx.insert(unitAddressesTable).values(addressInsert);
      }
    });

    return unit;
  }

  async findById(id: string): Promise<Unit | null> {
    const [unitRow] = await this.db
      .select()
      .from(unitsTable)
      .where(eq(unitsTable.id, id))
      .limit(1);

    if (!unitRow) {
      return null;
    }

    const [addressRow] = await this.db
      .select()
      .from(unitAddressesTable)
      .where(eq(unitAddressesTable.unitId, id))
      .limit(1);

    const address = addressRow ? UnitAddressMapper.toDomain(addressRow) : undefined;

    return UnitMapper.toDomain(unitRow, address);
  }

  async findBySlug(organizationId: string, slug: string): Promise<Unit | null> {
    const [unitRow] = await this.db
      .select()
      .from(unitsTable)
      .where(and(eq(unitsTable.organizationId, organizationId), eq(unitsTable.slug, slug)))
      .limit(1);

    if (!unitRow) {
      return null;
    }

    const [addressRow] = await this.db
      .select()
      .from(unitAddressesTable)
      .where(eq(unitAddressesTable.unitId, unitRow.id))
      .limit(1);

    const address = addressRow ? UnitAddressMapper.toDomain(addressRow) : undefined;

    return UnitMapper.toDomain(unitRow, address);
  }

  async findByOrganizationId(organizationId: string): Promise<Unit[]> {
    const unitRows = await this.db
      .select()
      .from(unitsTable)
      .where(eq(unitsTable.organizationId, organizationId));

    const units: Unit[] = [];

    for (const unitRow of unitRows) {
      const [addressRow] = await this.db
        .select()
        .from(unitAddressesTable)
        .where(eq(unitAddressesTable.unitId, unitRow.id))
        .limit(1);

      const address = addressRow ? UnitAddressMapper.toDomain(addressRow) : undefined;
      units.push(UnitMapper.toDomain(unitRow, address));
    }

    return units;
  }

  async update(unit: Unit): Promise<Unit> {
    const { unit: unitInsert } = UnitMapper.toPersistence(unit);

    await this.db.transaction(async (tx) => {
      await tx
        .update(unitsTable)
        .set({
          name: unitInsert.name,
          slug: unitInsert.slug,
          isSoloProfessional: unitInsert.isSoloProfessional,
          phone: unitInsert.phone,
          email: unitInsert.email,
          updatedAt: unitInsert.updatedAt,
          deletedAt: unitInsert.deletedAt,
        })
        .where(eq(unitsTable.id, unit.id));

      if (unit.address) {
        const addressInsert = UnitAddressMapper.toPersistence(unit.address);

        await tx
          .insert(unitAddressesTable)
          .values(addressInsert)
          .onConflictDoUpdate({
            target: unitAddressesTable.unitId,
            set: {
              street: addressInsert.street,
              number: addressInsert.number,
              complement: addressInsert.complement,
              neighborhood: addressInsert.neighborhood,
              city: addressInsert.city,
              state: addressInsert.state,
              zipCode: addressInsert.zipCode,
              country: addressInsert.country,
              latitude: addressInsert.latitude,
              longitude: addressInsert.longitude,
              updatedAt: addressInsert.updatedAt,
            },
          });
      }
    });

    return unit;
  }

  async softDelete(id: string): Promise<void> {
    await this.db.update(unitsTable).set({ deletedAt: new Date() }).where(eq(unitsTable.id, id));
  }

  async hasActiveBookings(unitId: string): Promise<boolean> {
    return false;
  }
}
