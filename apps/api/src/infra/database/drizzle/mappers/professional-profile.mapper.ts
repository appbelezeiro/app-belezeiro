import { ProfessionalProfile } from '../../../../domain/profile/professional/professional-profile.aggregate';
import { ProfessionalService } from '../../../../domain/profile/professional/professional-service.entity';
import { DisplayName } from '../../../../domain/profile/professional/value-objects/display-name.vo';
import { YearsOfExperience } from '../../../../domain/profile/professional/value-objects/years-experience.vo';
import {
  ProfessionalProfileRow,
  ProfessionalProfileInsert,
} from '../schemas/professional-profiles.schema';

export class ProfessionalProfileMapper {
  static toPersistence(profile: ProfessionalProfile): {
    profile: ProfessionalProfileInsert;
  } {
    const bookingRules = profile.getBookingRules();
    return {
      profile: {
        id: profile.id,
        userId: profile.userId,
        displayName: profile.displayName.value,
        bio: profile.bio ?? null,
        yearsOfExperience: profile.yearsOfExperience?.value ?? null,
        achievements: profile.achievements as string[],
        specialties: profile.specialties as string[],
        slotDurationMinutes: bookingRules.slotDurationMinutes,
        minAdvanceMinutes: bookingRules.minAdvanceMinutes,
        maxAdvanceDays: bookingRules.maxAdvanceDays,
        bufferMinutes: bookingRules.bufferMinutes,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    };
  }

  static toDomain(
    row: ProfessionalProfileRow,
    services: ProfessionalService[],
  ): ProfessionalProfile {
    return ProfessionalProfile.reconstitute({
      id: row.id,
      userId: row.userId,
      displayName: DisplayName.create(row.displayName),
      bio: row.bio ?? undefined,
      yearsOfExperience: row.yearsOfExperience
        ? YearsOfExperience.create(row.yearsOfExperience)
        : undefined,
      achievements: row.achievements as string[],
      specialties: row.specialties as string[],
      slotDurationMinutes: row.slotDurationMinutes,
      minAdvanceMinutes: row.minAdvanceMinutes,
      maxAdvanceDays: row.maxAdvanceDays,
      bufferMinutes: row.bufferMinutes,
      services,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
