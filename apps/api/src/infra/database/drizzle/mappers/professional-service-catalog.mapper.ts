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
      customPrice: professionalService.customPrice ?? null,
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
      customPrice: row.customPrice ?? undefined,
      customDuration: row.customDuration ?? undefined,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
