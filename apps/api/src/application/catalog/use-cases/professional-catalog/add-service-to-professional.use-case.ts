import { IProfessionalServiceRepository } from '../../../../contracts/repositories/professional-service.repository';
import { IServiceRepository } from '../../../../contracts/repositories/service.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { ProfessionalService } from '../../../../domain/catalog/professional-catalog/professional-service.entity';
import { ServiceNotFoundError } from '../../../../domain/catalog/service/service.errors';

class UseCase {
  constructor(
    private readonly professionalServiceRepository: IProfessionalServiceRepository,
    private readonly serviceRepository: IServiceRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const service = await this.serviceRepository.findById(input.serviceId);
    if (!service) {
      throw new ServiceNotFoundError(input.serviceId);
    }

    const existing = await this.professionalServiceRepository.findByProfessionalAndService(
      input.professionalProfileId,
      input.serviceId,
    );

    if (existing) {
      return { professionalServiceId: existing.id };
    }

    const professionalService = ProfessionalService.create({
      professionalProfileId: input.professionalProfileId,
      serviceId: input.serviceId,
      customPrice: input.customPrice,
      customDuration: input.customDuration,
      isActive: input.isActive,
    });

    await this.professionalServiceRepository.create(professionalService);

    return {
      professionalServiceId: professionalService.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalProfileId: string;
    serviceId: string;
    customPrice?: number;
    customDuration?: number;
    isActive?: boolean;
  };

  export type Output = {
    professionalServiceId: string;
  };
}

export { UseCase as AddServiceToProfessionalUseCase };
