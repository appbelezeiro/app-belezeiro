import { IUnitProfessionalServiceRepository } from '../../../../contracts/repositories/unit-professional-service.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { UnitProfessionalServiceNotFoundError } from '../../../../domain/catalog/unit-professional-service/unit-professional-service.errors';

class UseCase {
  constructor(
    private readonly unitProfessionalServiceRepository: IUnitProfessionalServiceRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const unitProfessionalService = await this.unitProfessionalServiceRepository.findById(
      input.unitProfessionalServiceId,
    );

    if (!unitProfessionalService) {
      throw new UnitProfessionalServiceNotFoundError(input.unitProfessionalServiceId);
    }

    if (input.unitPrice !== undefined) {
      unitProfessionalService.setUnitPrice(input.unitPrice);
    }

    if (input.unitDuration !== undefined) {
      unitProfessionalService.setUnitDuration(input.unitDuration);
    }

    await this.unitProfessionalServiceRepository.update(unitProfessionalService);

    return {
      success: true,
    };
  }
}

namespace UseCase {
  export type Input = {
    unitProfessionalServiceId: string;
    unitPrice?: number;
    unitDuration?: number;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as UpdateUnitProfessionalServicePriceUseCase };
