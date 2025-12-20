import { IOrganizationRepository } from '../../../../contracts/repositories/organization.repository';
import { IOwnerProfileRepository } from '../../../../contracts/repositories/owner-profile.repository';
import { Organization } from '../../../../domain/organization/organization.aggregate';

class UseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly ownerProfileRepository: IOwnerProfileRepository,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const ownerProfile = await this.ownerProfileRepository.findByUserId(input.userId);

    if (!ownerProfile) {
      return {
        organizations: [],
      };
    }

    const organizations = await this.organizationRepository.findByOwnerId(ownerProfile.id);

    return {
      organizations,
    };
  }
}

namespace UseCase {
  export type Input = {
    userId: string;
  };

  export type Output = {
    organizations: Organization[];
  };
}

export { UseCase as ListUserOrganizationsUseCase };
