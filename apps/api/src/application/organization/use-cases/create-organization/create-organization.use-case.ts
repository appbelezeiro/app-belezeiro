import { IOrganizationRepository } from '../../../../contracts/repositories/organization.repository';
import { IOwnerProfileRepository } from '../../../../contracts/repositories/owner-profile.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { Organization } from '../../../../domain/organization/organization.aggregate';
import { OwnerProfile } from '../../../../domain/profile/owner/owner-profile.aggregate';
import { SlugAlreadyExistsError } from '../../../../domain/organization/errors/slug-already-exists.error';

class UseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly ownerProfileRepository: IOwnerProfileRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const existingOrg = await this.organizationRepository.findBySlug(input.slug);

    if (existingOrg) {
      throw new SlugAlreadyExistsError(input.slug);
    }

    let ownerProfile = await this.ownerProfileRepository.findByUserId(input.userId);

    if (!ownerProfile) {
      ownerProfile = OwnerProfile.create({
        userId: input.userId,
        education: undefined,
      });

      await this.ownerProfileRepository.save(ownerProfile);

      const ownerEvents = ownerProfile.pullEvents();
      for (const event of ownerEvents) {
        await this.eventBus.publish(event);
      }
    }

    const organization = Organization.create({
      ownerId: ownerProfile.id,
      name: input.name,
      slug: input.slug,
      document: input.document,
      logo: input.logo,
      description: input.description,
      category: input.category,
    });

    await this.organizationRepository.create(organization);

    const events = organization.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      organizationId: organization.id,
      ownerId: ownerProfile.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    userId: string;
    name: string;
    slug: string;
    document?: string;
    logo?: string;
    description?: string;
    category?: string;
  };

  export type Output = {
    organizationId: string;
    ownerId: string;
  };
}

export { UseCase as CreateOrganizationUseCase };
