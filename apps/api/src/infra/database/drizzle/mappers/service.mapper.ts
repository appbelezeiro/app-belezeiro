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
      defaultPrice: service.defaultPrice?.toString() ?? null,
      defaultDuration: service.defaultDuration ?? null,
      isGlobal: service.isGlobal,
      ownerId: service.ownerId ?? null,
      unitId: service.unitId ?? null,
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
      defaultPrice: row.defaultPrice ? parseFloat(row.defaultPrice) : undefined,
      defaultDuration: row.defaultDuration ?? undefined,
      isGlobal: row.isGlobal,
      ownerId: row.ownerId ?? undefined,
      unitId: row.unitId ?? undefined,
      createdById: row.createdById ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
