import { IUnitProfessionalServiceRepository } from '../../../../contracts/repositories/unit-professional-service.repository';
import { IServiceRepository } from '../../../../contracts/repositories/service.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { UnitProfessionalService } from '../../../../domain/catalog/unit-professional-service/unit-professional-service.entity';
import { ServiceNotFoundError } from '../../../../domain/catalog/service/service.errors';

class UseCase {
  constructor(
    private readonly unitProfessionalServiceRepository: IUnitProfessionalServiceRepository,
    private readonly serviceRepository: IServiceRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const service = await this.serviceRepository.findById(input.serviceId);
    if (!service) {
      throw new ServiceNotFoundError(input.serviceId);
    }

    const unitProfessionalService = UnitProfessionalService.create({
      unitProfessionalLinkId: input.unitProfessionalLinkId,
      serviceId: input.serviceId,
      unitPrice: input.unitPrice,
      unitDuration: input.unitDuration,
      isActive: input.isActive,
    });

    await this.unitProfessionalServiceRepository.create(unitProfessionalService);

    return {
      unitProfessionalServiceId: unitProfessionalService.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    unitProfessionalLinkId: string;
    serviceId: string;
    unitPrice?: number;
    unitDuration?: number;
    isActive?: boolean;
  };

  export type Output = {
    unitProfessionalServiceId: string;
  };
}

export { UseCase as AddServiceToUnitProfessionalUseCase };
