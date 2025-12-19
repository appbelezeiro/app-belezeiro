import { CustomerAddress } from '../../../../domain/profile/customer/customer-address.entity';
import { AddressLabel } from '../../../../domain/profile/customer/value-objects/address-label.vo';
import {
  CustomerAddressRow,
  CustomerAddressInsert,
} from '../schemas/customer-addresses.schema';

export class CustomerAddressMapper {
  static toPersistence(address: CustomerAddress): CustomerAddressInsert {
    return {
      id: address.id,
      customerProfileId: address.customerProfileId,
      street: address.street,
      number: address.number,
      complement: address.complement ?? null,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      label: address.label.value,
      isPrimary: address.isPrimary,
      latitude: address.latitude ?? null,
      longitude: address.longitude ?? null,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }

  static toDomain(row: CustomerAddressRow): CustomerAddress {
    return CustomerAddress.reconstitute({
      id: row.id,
      customerProfileId: row.customerProfileId,
      street: row.street,
      number: row.number,
      complement: row.complement ?? undefined,
      neighborhood: row.neighborhood,
      city: row.city,
      state: row.state,
      zipCode: row.zipCode,
      country: row.country,
      label: AddressLabel.create(row.label),
      isPrimary: row.isPrimary,
      latitude: row.latitude ?? undefined,
      longitude: row.longitude ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
