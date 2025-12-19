import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { UnitProfessionalLink } from '../../../../domain/organization/unit/unit-professional-link.entity';

class UseCase {
  constructor(private readonly eventBus: IEventBus) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const link = UnitProfessionalLink.create({
      unitId: input.unitId,
      professionalProfileId: input.professionalProfileId,
      invitedBy: input.invitedBy,
    });

    return {
      linkId: link.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    unitId: string;
    professionalProfileId: string;
    invitedBy: string;
  };

  export type Output = {
    linkId: string;
  };
}

export { UseCase as InviteProfessionalToUnitUseCase };
