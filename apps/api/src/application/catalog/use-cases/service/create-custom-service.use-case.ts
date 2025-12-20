import { IServiceRepository } from '../../../../contracts/repositories/service.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { Service } from '../../../../domain/catalog/service/service.aggregate';

class UseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    let service: Service;

    if (input.professionalProfileId) {
      service = Service.createCustomForProfessional({
        professionalProfileId: input.professionalProfileId,
        name: input.name,
        description: input.description,
        defaultPrice: input.defaultPrice,
        defaultDuration: input.defaultDuration,
      });
    } else if (input.unitId && input.createdById) {
      service = Service.createCustomForUnit({
        unitId: input.unitId,
        createdById: input.createdById,
        name: input.name,
        description: input.description,
        defaultPrice: input.defaultPrice,
        defaultDuration: input.defaultDuration,
      });
    } else {
      throw new Error('Either professionalProfileId or (unitId and createdById) must be provided');
    }

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
    professionalProfileId?: string;
    unitId?: string;
    createdById?: string;
    name: string;
    description?: string;
    defaultPrice?: number;
    defaultDuration?: number;
  };

  export type Output = {
    serviceId: string;
  };
}

export { UseCase as CreateCustomServiceUseCase };
