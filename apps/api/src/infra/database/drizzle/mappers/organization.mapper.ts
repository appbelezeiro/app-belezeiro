import { Organization } from '../../../../domain/organization/organization.aggregate';
import { OrganizationRow, OrganizationInsert } from '../schemas/organizations.schema';

export class OrganizationMapper {
  static toPersistence(organization: Organization): { organization: OrganizationInsert } {
    return {
      organization: {
        id: organization.id,
        ownerId: organization.ownerId,
        name: organization.name,
        slug: organization.slug,
        document: organization.document ?? null,
        logo: organization.logo ?? null,
        description: organization.description ?? null,
        category: organization.category ?? null,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        deletedAt: organization.deletedAt ?? null,
      },
    };
  }

  static toDomain(row: OrganizationRow): Organization {
    return Organization.reconstitute({
      id: row.id,
      ownerId: row.ownerId,
      name: row.name,
      slug: row.slug,
      document: row.document ?? undefined,
      logo: row.logo ?? undefined,
      description: row.description ?? undefined,
      category: row.category ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    });
  }
}
