import { ProfessionalService } from '../../domain/catalog/professional-catalog/professional-service.entity';

export interface IProfessionalServiceRepository {
  create(professionalService: ProfessionalService): Promise<ProfessionalService>;
  findById(id: string): Promise<ProfessionalService | null>;
  findByProfessionalId(professionalProfileId: string): Promise<ProfessionalService[]>;
  findByProfessionalAndService(
    professionalProfileId: string,
    serviceId: string,
  ): Promise<ProfessionalService | null>;
  update(professionalService: ProfessionalService): Promise<ProfessionalService>;
  delete(id: string): Promise<void>;
}
