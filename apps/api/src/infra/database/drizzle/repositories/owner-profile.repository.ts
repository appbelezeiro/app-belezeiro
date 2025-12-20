import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IOwnerProfileRepository } from '../../../../contracts/repositories/owner-profile.repository';
import { OwnerProfile } from '../../../../domain/profile/owner/owner-profile.aggregate';
import { ownerProfilesTable } from '../schemas/owner-profiles.schema';
import { OwnerProfileMapper } from '../mappers/owner-profile.mapper';

export class OwnerProfileRepository implements IOwnerProfileRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async findById(id: string): Promise<OwnerProfile | null> {
    const [profileRow] = await this.db
      .select()
      .from(ownerProfilesTable)
      .where(eq(ownerProfilesTable.id, id))
      .limit(1);

    if (!profileRow) {
      return null;
    }

    return OwnerProfileMapper.toDomain(profileRow);
  }

  async findByUserId(userId: string): Promise<OwnerProfile | null> {
    const [profileRow] = await this.db
      .select()
      .from(ownerProfilesTable)
      .where(eq(ownerProfilesTable.userId, userId))
      .limit(1);

    if (!profileRow) {
      return null;
    }

    return OwnerProfileMapper.toDomain(profileRow);
  }

  async save(profile: OwnerProfile): Promise<void> {
    const { profile: profileInsert } = OwnerProfileMapper.toPersistence(profile);

    await this.db
      .insert(ownerProfilesTable)
      .values(profileInsert)
      .onConflictDoUpdate({
        target: ownerProfilesTable.id,
        set: {
          education: profileInsert.education,
          updatedAt: profileInsert.updatedAt,
        },
      });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(ownerProfilesTable).where(eq(ownerProfilesTable.id, id));
  }
}
