import { UnitProfessionalService } from '../../domain/catalog/unit-professional-service/unit-professional-service.entity';

export interface IUnitProfessionalServiceRepository {
  create(unitProfessionalService: UnitProfessionalService): Promise<UnitProfessionalService>;
  findById(id: string): Promise<UnitProfessionalService | null>;
  findByUnitProfessionalLinkId(
    unitProfessionalLinkId: string,
  ): Promise<UnitProfessionalService[]>;
  findByUnitId(unitId: string): Promise<UnitProfessionalService[]>;
  update(unitProfessionalService: UnitProfessionalService): Promise<UnitProfessionalService>;
  delete(id: string): Promise<void>;
}
