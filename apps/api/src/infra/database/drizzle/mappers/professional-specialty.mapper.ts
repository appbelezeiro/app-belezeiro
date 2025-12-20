import { ProfessionalSpecialty } from '../../../../domain/catalog/professional-catalog/professional-specialty.entity';
import {
  ProfessionalSpecialtyRow,
  ProfessionalSpecialtyInsert,
} from '../schemas/professional-specialties.schema';

export class ProfessionalSpecialtyMapper {
  static toPersistence(professionalSpecialty: ProfessionalSpecialty): ProfessionalSpecialtyInsert {
    return {
      id: professionalSpecialty.id,
      professionalProfileId: professionalSpecialty.professionalProfileId,
      specialtyId: professionalSpecialty.specialtyId,
      createdAt: professionalSpecialty.createdAt,
      updatedAt: professionalSpecialty.updatedAt,
    };
  }

  static toDomain(row: ProfessionalSpecialtyRow): ProfessionalSpecialty {
    return ProfessionalSpecialty.reconstitute({
      id: row.id,
      professionalProfileId: row.professionalProfileId,
      specialtyId: row.specialtyId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
