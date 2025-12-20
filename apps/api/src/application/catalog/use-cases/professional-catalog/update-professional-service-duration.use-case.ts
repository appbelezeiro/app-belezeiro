import { IProfessionalServiceRepository } from '../../../../contracts/repositories/professional-service.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { ProfessionalServiceNotFoundError } from '../../../../domain/catalog/professional-catalog/professional-catalog.errors';

class UseCase {
  constructor(
    private readonly professionalServiceRepository: IProfessionalServiceRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const professionalService = await this.professionalServiceRepository.findById(
      input.professionalServiceId,
    );

    if (!professionalService) {
      throw new ProfessionalServiceNotFoundError(input.professionalServiceId);
    }

    professionalService.updateDuration(input.customDuration);

    await this.professionalServiceRepository.update(professionalService);

    return {
      success: true,
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalServiceId: string;
    customDuration: number;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as UpdateProfessionalServiceDurationUseCase };
