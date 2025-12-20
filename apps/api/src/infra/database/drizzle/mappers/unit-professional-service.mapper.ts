import { UnitProfessionalService } from '../../../../domain/catalog/unit-professional-service/unit-professional-service.entity';
import {
  UnitProfessionalServiceRow,
  UnitProfessionalServiceInsert,
} from '../schemas/unit-professional-services.schema';

export class UnitProfessionalServiceMapper {
  static toPersistence(unitProfessionalService: UnitProfessionalService): UnitProfessionalServiceInsert {
    return {
      id: unitProfessionalService.id,
      unitProfessionalLinkId: unitProfessionalService.unitProfessionalLinkId,
      serviceId: unitProfessionalService.serviceId,
      unitPrice: unitProfessionalService.unitPrice?.toString() ?? null,
      unitDuration: unitProfessionalService.unitDuration ?? null,
      isActive: unitProfessionalService.isActive,
      createdAt: unitProfessionalService.createdAt,
      updatedAt: unitProfessionalService.updatedAt,
    };
  }

  static toDomain(row: UnitProfessionalServiceRow): UnitProfessionalService {
    return UnitProfessionalService.reconstitute({
      id: row.id,
      unitProfessionalLinkId: row.unitProfessionalLinkId,
      serviceId: row.serviceId,
      unitPrice: row.unitPrice ? parseFloat(row.unitPrice) : undefined,
      unitDuration: row.unitDuration ?? undefined,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
