import { SpecialtyService } from '../../../../domain/catalog/specialty/specialty-service.entity';
import {
  SpecialtyServiceRow,
  SpecialtyServiceInsert,
} from '../schemas/specialty-services.schema';

export class SpecialtyServiceMapper {
  static toPersistence(specialtyService: SpecialtyService): SpecialtyServiceInsert {
    return {
      specialtyId: specialtyService.specialtyId,
      serviceId: specialtyService.serviceId,
    };
  }

  static toDomain(row: SpecialtyServiceRow): SpecialtyService {
    return SpecialtyService.create({
      specialtyId: row.specialtyId,
      serviceId: row.serviceId,
    });
  }
}
