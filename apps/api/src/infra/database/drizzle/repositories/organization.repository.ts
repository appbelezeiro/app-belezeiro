import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IOrganizationRepository } from '../../../../contracts/repositories/organization.repository';
import { Organization } from '../../../../domain/organization/organization.aggregate';
import { organizationsTable } from '../schemas/organizations.schema';
import { OrganizationMapper } from '../mappers/organization.mapper';

export class OrganizationRepository implements IOrganizationRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async create(organization: Organization): Promise<Organization> {
    const { organization: organizationInsert } =
      OrganizationMapper.toPersistence(organization);

    await this.db.insert(organizationsTable).values(organizationInsert);

    return organization;
  }

  async findById(id: string): Promise<Organization | null> {
    const [row] = await this.db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return OrganizationMapper.toDomain(row);
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const [row] = await this.db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.slug, slug))
      .limit(1);

    if (!row) {
      return null;
    }

    return OrganizationMapper.toDomain(row);
  }

  async findByUserId(userId: string): Promise<Organization[]> {
    const rows = await this.db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.userId, userId));

    return rows.map((row) => OrganizationMapper.toDomain(row));
  }

  async update(organization: Organization): Promise<Organization> {
    const { organization: organizationInsert } =
      OrganizationMapper.toPersistence(organization);

    await this.db
      .update(organizationsTable)
      .set({
        name: organizationInsert.name,
        slug: organizationInsert.slug,
        description: organizationInsert.description,
        photoUrl: organizationInsert.photoUrl,
        address: organizationInsert.address,
        phone: organizationInsert.phone,
        updatedAt: organizationInsert.updatedAt,
        deletedAt: organizationInsert.deletedAt,
      })
      .where(eq(organizationsTable.id, organization.id));

    return organization;
  }

  async softDelete(id: string): Promise<void> {
    const now = new Date();

    await this.db
      .update(organizationsTable)
      .set({ deletedAt: now })
      .where(eq(organizationsTable.id, id));
  }
}
