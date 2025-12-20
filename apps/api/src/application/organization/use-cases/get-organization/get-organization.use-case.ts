import { IOrganizationRepository } from '../../../../contracts/repositories/organization.repository';
import { Organization } from '../../../../domain/organization/organization.aggregate';

class UseCase {
  constructor(private readonly organizationRepository: IOrganizationRepository) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    let organization: Organization | null = null;

    if (input.organizationId) {
      organization = await this.organizationRepository.findById(input.organizationId);
    } else if (input.slug) {
      organization = await this.organizationRepository.findBySlug(input.slug);
    }

    return {
      organization: organization ?? undefined,
    };
  }
}

namespace UseCase {
  export type Input = {
    organizationId?: string;
    slug?: string;
  };

  export type Output = {
    organization?: Organization;
  };
}

export { UseCase as GetOrganizationUseCase };
