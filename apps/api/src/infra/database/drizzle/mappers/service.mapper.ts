import { Service } from '../../../../domain/catalog/service/service.aggregate';
import {
  ServiceRow,
  ServiceInsert,
} from '../schemas/services.schema';

export class ServiceMapper {
  static toPersistence(service: Service): ServiceInsert {
    return {
      id: service.id,
      name: service.name,
      description: service.description ?? null,
      defaultDuration: service.defaultDuration ?? null,
      isGlobal: service.isGlobal,
      ownerId: service.ownerId ?? null,
      createdById: service.createdById ?? null,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }

  static toDomain(row: ServiceRow): Service {
    return Service.reconstitute({
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      defaultDuration: row.defaultDuration ?? undefined,
      isGlobal: row.isGlobal,
      ownerId: row.ownerId ?? undefined,
      createdById: row.createdById ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
