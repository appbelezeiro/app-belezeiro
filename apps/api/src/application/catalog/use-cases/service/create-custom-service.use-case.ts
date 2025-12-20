import { IServiceRepository } from '../../../../contracts/repositories/service.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { Service } from '../../../../domain/catalog/service/service.aggregate';

class UseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const service = Service.createCustomForProfessional({
      professionalProfileId: input.professionalProfileId,
      name: input.name,
      description: input.description,
      defaultDuration: input.defaultDuration,
    });

    await this.serviceRepository.create(service);

    const events = service.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      serviceId: service.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalProfileId: string;
    name: string;
    description?: string;
    defaultDuration?: number;
  };

  export type Output = {
    serviceId: string;
  };
}

export { UseCase as CreateCustomServiceUseCase };
