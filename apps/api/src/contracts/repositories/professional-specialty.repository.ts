import { ProfessionalSpecialty } from '../../domain/catalog/professional-catalog/professional-specialty.entity';

export interface IProfessionalSpecialtyRepository {
  create(professionalSpecialty: ProfessionalSpecialty): Promise<ProfessionalSpecialty>;
  findByProfessionalId(professionalProfileId: string): Promise<ProfessionalSpecialty[]>;
  delete(id: string): Promise<void>;
  exists(professionalProfileId: string, specialtyId: string): Promise<boolean>;
}
