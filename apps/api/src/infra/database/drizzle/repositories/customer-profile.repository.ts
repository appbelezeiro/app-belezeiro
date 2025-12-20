import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ICustomerProfileRepository } from '../../../../contracts/repositories/customer-profile.repository';
import { CustomerProfile } from '../../../../domain/profile/customer/customer-profile.aggregate';
import { customerProfilesTable } from '../schemas/customer-profiles.schema';
import { customerAddressesTable } from '../schemas/customer-addresses.schema';
import { CustomerProfileMapper } from '../mappers/customer-profile.mapper';
import { CustomerAddressMapper } from '../mappers/customer-address.mapper';

export class CustomerProfileRepository implements ICustomerProfileRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async findById(id: string): Promise<CustomerProfile | null> {
    const [profileRow] = await this.db
      .select()
      .from(customerProfilesTable)
      .where(eq(customerProfilesTable.id, id))
      .limit(1);

    if (!profileRow) {
      return null;
    }

    const addressRows = await this.db
      .select()
      .from(customerAddressesTable)
      .where(eq(customerAddressesTable.customerProfileId, id));

    const addresses = addressRows.map((row) => CustomerAddressMapper.toDomain(row));

    return CustomerProfileMapper.toDomain(profileRow, addresses);
  }

  async findByUserId(userId: string): Promise<CustomerProfile | null> {
    const [profileRow] = await this.db
      .select()
      .from(customerProfilesTable)
      .where(eq(customerProfilesTable.userId, userId))
      .limit(1);

    if (!profileRow) {
      return null;
    }

    const addressRows = await this.db
      .select()
      .from(customerAddressesTable)
      .where(eq(customerAddressesTable.customerProfileId, profileRow.id));

    const addresses = addressRows.map((row) => CustomerAddressMapper.toDomain(row));

    return CustomerProfileMapper.toDomain(profileRow, addresses);
  }

  async save(profile: CustomerProfile): Promise<void> {
    const { profile: profileInsert } = CustomerProfileMapper.toPersistence(profile);

    await this.db.transaction(async (tx) => {
      await tx
        .insert(customerProfilesTable)
        .values(profileInsert)
        .onConflictDoUpdate({
          target: customerProfilesTable.id,
          set: {
            preferredServices: profileInsert.preferredServices,
            notes: profileInsert.notes,
            updatedAt: profileInsert.updatedAt,
          },
        });

      await tx
        .delete(customerAddressesTable)
        .where(eq(customerAddressesTable.customerProfileId, profile.id));

      if (profile.addresses.length > 0) {
        const addressesInsert = profile.addresses.map((address) =>
          CustomerAddressMapper.toPersistence(address),
        );

        await tx.insert(customerAddressesTable).values(addressesInsert);
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(customerProfilesTable).where(eq(customerProfilesTable.id, id));
  }
}
