import { Service } from '../../domain/catalog/service/service.aggregate';

export interface IServiceRepository {
  create(service: Service): Promise<Service>;
  findById(id: string): Promise<Service | null>;
  findGlobal(): Promise<Service[]>;
  findBySpecialtyIds(specialtyIds: string[]): Promise<Service[]>;
  findByUnitId(unitId: string): Promise<Service[]>;
  update(service: Service): Promise<Service>;
}
