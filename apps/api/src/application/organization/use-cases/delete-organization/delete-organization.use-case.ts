import { IOrganizationRepository } from '../../../../contracts/repositories/organization.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { OrganizationNotFoundError } from '../../../../domain/organization/errors/organization-not-found.error';
import { CannotDeleteOrgWithActiveUnitsError } from '../../../../domain/organization/errors/cannot-delete-org-with-active-units.error';

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

    const hasActiveUnits = await this.organizationRepository.hasActiveUnits(
      input.organizationId,
    );

    if (!organization.canDelete(hasActiveUnits)) {
      throw new CannotDeleteOrgWithActiveUnitsError(input.organizationId);
    }

    await this.organizationRepository.softDelete(input.organizationId);

    organization.softDelete();

    const events = organization.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      success: true,
    };
  }
}

namespace UseCase {
  export type Input = {
    organizationId: string;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as DeleteOrganizationUseCase };
