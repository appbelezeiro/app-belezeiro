import { ProfessionalProfile } from '../../domain/profile/professional/professional-profile.aggregate';

export interface IProfessionalProfileRepository {
  findById(id: string): Promise<ProfessionalProfile | null>;
  findByUserId(userId: string): Promise<ProfessionalProfile | null>;
  save(profile: ProfessionalProfile): Promise<void>;
  delete(id: string): Promise<void>;
}
