import { CustomerProfile } from '../../../../domain/profile/customer/customer-profile.aggregate';
import { CustomerAddress } from '../../../../domain/profile/customer/customer-address.entity';
import {
  CustomerProfileRow,
  CustomerProfileInsert,
} from '../schemas/customer-profiles.schema';

export class CustomerProfileMapper {
  static toPersistence(profile: CustomerProfile): {
    profile: CustomerProfileInsert;
  } {
    return {
      profile: {
        id: profile.id,
        userId: profile.userId,
        preferredServices: profile.preferredServices as string[],
        notes: profile.notes ?? null,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    };
  }

  static toDomain(row: CustomerProfileRow, addresses: CustomerAddress[]): CustomerProfile {
    return CustomerProfile.reconstitute({
      id: row.id,
      userId: row.userId,
      preferredServices: row.preferredServices as string[],
      notes: row.notes ?? undefined,
      addresses,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
