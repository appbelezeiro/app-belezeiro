import { IOrganizationRepository } from '../../../../contracts/repositories/organization.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { OrganizationNotFoundError } from '../../../../domain/organization/errors/organization-not-found.error';
import { SlugAlreadyExistsError } from '../../../../domain/organization/errors/slug-already-exists.error';

class UseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const organization = await this.organizationRepository.findById(input.organizationId);

    if (!organization) {
      throw new OrganizationNotFoundError(input.organizationId);
    }

    if (input.slug && input.slug !== organization.slug) {
      const existing = await this.organizationRepository.findBySlug(input.slug);
      if (existing) {
        throw new SlugAlreadyExistsError(input.slug);
      }
    }

    organization.update({
      name: input.name,
      slug: input.slug,
      document: input.document,
      logo: input.logo,
      description: input.description,
      category: input.category,
    });

    await this.organizationRepository.update(organization);

    const events = organization.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      organizationId: organization.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    organizationId: string;
    name?: string;
    slug?: string;
    document?: string;
    logo?: string;
    description?: string;
    category?: string;
  };

  export type Output = {
    organizationId: string;
  };
}

export { UseCase as UpdateOrganizationUseCase };
