import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IProfessionalProfileRepository } from '../../../../contracts/repositories/professional-profile.repository';
import { ProfessionalProfile } from '../../../../domain/profile/professional/professional-profile.aggregate';
import { professionalProfilesTable } from '../schemas/professional-profiles.schema';
import { professionalServicesTable } from '../schemas/professional-services.schema';
import { ProfessionalProfileMapper } from '../mappers/professional-profile.mapper';
import { ProfessionalServiceMapper } from '../mappers/professional-service.mapper';

export class ProfessionalProfileRepository implements IProfessionalProfileRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async findById(id: string): Promise<ProfessionalProfile | null> {
    const [profileRow] = await this.db
      .select()
      .from(professionalProfilesTable)
      .where(eq(professionalProfilesTable.id, id))
      .limit(1);

    if (!profileRow) {
      return null;
    }

    const serviceRows = await this.db
      .select()
      .from(professionalServicesTable)
      .where(eq(professionalServicesTable.professionalProfileId, id));

    const services = serviceRows.map((row) => ProfessionalServiceMapper.toDomain(row));

    return ProfessionalProfileMapper.toDomain(profileRow, services);
  }

  async findByUserId(userId: string): Promise<ProfessionalProfile | null> {
    const [profileRow] = await this.db
      .select()
      .from(professionalProfilesTable)
      .where(eq(professionalProfilesTable.userId, userId))
      .limit(1);

    if (!profileRow) {
      return null;
    }

    const serviceRows = await this.db
      .select()
      .from(professionalServicesTable)
      .where(eq(professionalServicesTable.professionalProfileId, profileRow.id));

    const services = serviceRows.map((row) => ProfessionalServiceMapper.toDomain(row));

    return ProfessionalProfileMapper.toDomain(profileRow, services);
  }

  async save(profile: ProfessionalProfile): Promise<void> {
    const { profile: profileInsert } = ProfessionalProfileMapper.toPersistence(profile);

    await this.db.transaction(async (tx) => {
      await tx
        .insert(professionalProfilesTable)
        .values(profileInsert)
        .onConflictDoUpdate({
          target: professionalProfilesTable.id,
          set: {
            displayName: profileInsert.displayName,
            bio: profileInsert.bio,
            yearsOfExperience: profileInsert.yearsOfExperience,
            achievements: profileInsert.achievements,
            specialties: profileInsert.specialties,
            updatedAt: profileInsert.updatedAt,
          },
        });

      await tx
        .delete(professionalServicesTable)
        .where(eq(professionalServicesTable.professionalProfileId, profile.id));

      if (profile.services.length > 0) {
        const servicesInsert = profile.services.map((service) =>
          ProfessionalServiceMapper.toPersistence(service),
        );

        await tx.insert(professionalServicesTable).values(servicesInsert);
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(professionalProfilesTable)
      .where(eq(professionalProfilesTable.id, id));
  }
}
