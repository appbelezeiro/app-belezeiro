import { IServiceRepository } from '../../../../contracts/repositories/service.repository';
import { ServiceNotFoundError } from '../../../../domain/catalog/service/service.errors';

class UseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const service = await this.serviceRepository.findById(input.serviceId);

    if (!service) {
      throw new ServiceNotFoundError(input.serviceId);
    }

    return {
      service: {
        id: service.id,
        name: service.name,
        description: service.description,
        defaultPrice: service.defaultPrice,
        defaultDuration: service.defaultDuration,
        isGlobal: service.isGlobal,
        ownerId: service.ownerId,
        unitId: service.unitId,
        createdById: service.createdById,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      },
    };
  }
}

namespace UseCase {
  export type Input = {
    serviceId: string;
  };

  export type Output = {
    service: {
      id: string;
      name: string;
      description?: string;
      defaultPrice?: number;
      defaultDuration?: number;
      isGlobal: boolean;
      ownerId?: string;
      unitId?: string;
      createdById?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

export { UseCase as GetServiceUseCase };
