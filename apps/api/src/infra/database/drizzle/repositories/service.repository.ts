import { eq, inArray } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IServiceRepository } from '../../../../contracts/repositories/service.repository';
import { Service } from '../../../../domain/catalog/service/service.aggregate';
import { servicesTable } from '../schemas/services.schema';
import { specialtyServicesTable } from '../schemas/specialty-services.schema';
import { ServiceMapper } from '../mappers/service.mapper';

export class ServiceRepository implements IServiceRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async create(service: Service): Promise<Service> {
    const serviceInsert = ServiceMapper.toPersistence(service);

    await this.db.insert(servicesTable).values(serviceInsert);

    return service;
  }

  async findById(id: string): Promise<Service | null> {
    const [row] = await this.db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return ServiceMapper.toDomain(row);
  }

  async findGlobal(): Promise<Service[]> {
    const rows = await this.db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.isGlobal, true));

    return rows.map((row) => ServiceMapper.toDomain(row));
  }

  async findBySpecialtyIds(specialtyIds: string[]): Promise<Service[]> {
    if (specialtyIds.length === 0) {
      return [];
    }

    const specialtyServiceRows = await this.db
      .select()
      .from(specialtyServicesTable)
      .where(inArray(specialtyServicesTable.specialtyId, specialtyIds));

    if (specialtyServiceRows.length === 0) {
      return [];
    }

    const serviceIds = specialtyServiceRows.map((row) => row.serviceId);

    const rows = await this.db
      .select()
      .from(servicesTable)
      .where(inArray(servicesTable.id, serviceIds));

    return rows.map((row) => ServiceMapper.toDomain(row));
  }

  async update(service: Service): Promise<Service> {
    const serviceInsert = ServiceMapper.toPersistence(service);

    await this.db
      .update(servicesTable)
      .set({
        name: serviceInsert.name,
        description: serviceInsert.description,
        defaultDuration: serviceInsert.defaultDuration,
        updatedAt: serviceInsert.updatedAt,
      })
      .where(eq(servicesTable.id, service.id));

    return service;
  }
}
