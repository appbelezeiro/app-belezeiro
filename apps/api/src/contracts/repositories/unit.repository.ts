import { Unit } from '../../domain/organization/unit/unit.aggregate';

export interface IUnitRepository {
  create(unit: Unit): Promise<Unit>;
  findById(id: string): Promise<Unit | null>;
  findBySlug(organizationId: string, slug: string): Promise<Unit | null>;
  findByOrganizationId(organizationId: string): Promise<Unit[]>;
  update(unit: Unit): Promise<Unit>;
  softDelete(id: string): Promise<void>;
  hasActiveBookings(unitId: string): Promise<boolean>;
}
