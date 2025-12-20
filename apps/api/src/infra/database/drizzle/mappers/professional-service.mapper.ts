import { ProfessionalService } from '../../../../domain/profile/professional/professional-service.entity';
import {
  ProfessionalServiceRow,
  ProfessionalServiceInsert,
} from '../schemas/professional-services.schema';

export class ProfessionalServiceMapper {
  static toPersistence(service: ProfessionalService): ProfessionalServiceInsert {
    return {
      id: service.id,
      professionalProfileId: service.professionalProfileId,
      serviceId: service.serviceId,
      customPrice: service.customPrice ?? null,
      customDuration: service.customDuration ?? null,
      isActive: service.isActive,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
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
