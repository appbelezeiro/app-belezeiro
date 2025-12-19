import { OwnerProfile } from '../../../../domain/profile/owner/owner-profile.aggregate';
import { OwnerProfileRow, OwnerProfileInsert } from '../schemas/owner-profiles.schema';

export class OwnerProfileMapper {
  static toPersistence(profile: OwnerProfile): {
    profile: OwnerProfileInsert;
  } {
    return {
      profile: {
        id: profile.id,
        userId: profile.userId,
        education: profile.education ?? null,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    };
  }

  static toDomain(row: OwnerProfileRow): OwnerProfile {
    return OwnerProfile.reconstitute({
      id: row.id,
      userId: row.userId,
      education: row.education ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
