import { IServiceRepository } from '../../../../contracts/repositories/service.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { ServiceNotFoundError } from '../../../../domain/catalog/service/service.errors';

class UseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const service = await this.serviceRepository.findById(input.serviceId);

    if (!service) {
      throw new ServiceNotFoundError(input.serviceId);
    }

    service.update({
      name: input.name,
      description: input.description,
      defaultPrice: input.defaultPrice,
      defaultDuration: input.defaultDuration,
    });

    await this.serviceRepository.update(service);

    const events = service.pullEvents();
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
    serviceId: string;
    name?: string;
    description?: string;
    defaultPrice?: number;
    defaultDuration?: number;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as UpdateServiceUseCase };
