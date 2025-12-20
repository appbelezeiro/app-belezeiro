import { ProfessionalService } from '../../../../domain/catalog/professional-catalog/professional-service.entity';
import {
  ProfessionalServiceRow,
  ProfessionalServiceInsert,
} from '../schemas/professional-services.schema';

export class ProfessionalServiceCatalogMapper {
  static toPersistence(professionalService: ProfessionalService): ProfessionalServiceInsert {
    return {
      id: professionalService.id,
      professionalProfileId: professionalService.professionalProfileId,
      serviceId: professionalService.serviceId,
      customDuration: professionalService.customDuration ?? null,
      isActive: professionalService.isActive,
      createdAt: professionalService.createdAt,
      updatedAt: professionalService.updatedAt,
    };
  }

  static toDomain(row: ProfessionalServiceRow): ProfessionalService {
    return ProfessionalService.reconstitute({
      id: row.id,
      professionalProfileId: row.professionalProfileId,
      serviceId: row.serviceId,
      customDuration: row.customDuration ?? undefined,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
