import { Organization } from '../../../../domain/organization/organization.aggregate';
import { OrganizationRow, OrganizationInsert } from '../schemas/organizations.schema';

export class OrganizationMapper {
  static toPersistence(organization: Organization): { organization: OrganizationInsert } {
    return {
      organization: {
        id: organization.id,
        userId: organization.userId,
        name: organization.name,
        slug: organization.slug,
        description: organization.description ?? null,
        photoUrl: organization.photoUrl ?? null,
        address: organization.address ?? null,
        phone: organization.phone ?? null,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        deletedAt: organization.deletedAt ?? null,
      },
    };
  }

  static toDomain(row: OrganizationRow): Organization {
    return Organization.reconstitute({
      id: row.id,
      userId: row.userId,
      name: row.name,
      slug: row.slug,
      description: row.description ?? undefined,
      photoUrl: row.photoUrl ?? undefined,
      address: row.address ?? undefined,
      phone: row.phone ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    });
  }
}
