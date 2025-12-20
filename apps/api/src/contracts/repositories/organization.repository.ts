import { Organization } from '../../domain/organization/organization.aggregate';

export interface IOrganizationRepository {
  create(organization: Organization): Promise<Organization>;
  findById(id: string): Promise<Organization | null>;
  findBySlug(slug: string): Promise<Organization | null>;
  findByUserId(userId: string): Promise<Organization[]>;
  update(organization: Organization): Promise<Organization>;
  softDelete(id: string): Promise<void>;
}
