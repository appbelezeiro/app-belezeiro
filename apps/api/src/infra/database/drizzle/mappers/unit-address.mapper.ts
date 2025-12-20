import { UnitAddress } from '../../../../domain/organization/unit/unit-address.entity';
import { UnitAddressRow, UnitAddressInsert } from '../schemas/unit-addresses.schema';

export class UnitAddressMapper {
  static toPersistence(address: UnitAddress): UnitAddressInsert {
    return {
      id: address.id,
      unitId: address.unitId,
      street: address.street,
      number: address.number,
      complement: address.complement ?? null,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      latitude: address.latitude ?? null,
      longitude: address.longitude ?? null,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }

  static toDomain(row: UnitAddressRow): UnitAddress {
    return UnitAddress.reconstitute({
      id: row.id,
      unitId: row.unitId,
      street: row.street,
      number: row.number,
      complement: row.complement ?? undefined,
      neighborhood: row.neighborhood,
      city: row.city,
      state: row.state,
      zipCode: row.zipCode,
      country: row.country,
      latitude: row.latitude ?? undefined,
      longitude: row.longitude ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
