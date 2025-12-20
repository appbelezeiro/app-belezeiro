import { IServiceRepository } from '../../../../contracts/repositories/service.repository';

class UseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const services = await this.serviceRepository.findBySpecialtyIds(input.specialtyIds);

    return {
      services: services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        defaultPrice: service.defaultPrice,
        defaultDuration: service.defaultDuration,
        isGlobal: service.isGlobal,
      })),
    };
  }
}

namespace UseCase {
  export type Input = {
    specialtyIds: string[];
  };

  export type Output = {
    services: Array<{
      id: string;
      name: string;
      description?: string;
      defaultPrice?: number;
      defaultDuration?: number;
      isGlobal: boolean;
    }>;
  };
}

export { UseCase as ListServicesBySpecialtiesUseCase };
