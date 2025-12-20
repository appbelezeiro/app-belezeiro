import { SpecialtyServiceRepository } from '../../../../infra/database/drizzle/repositories/specialty-service.repository';

class UseCase {
  constructor(private readonly specialtyServiceRepository: SpecialtyServiceRepository) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    await this.specialtyServiceRepository.delete(input.specialtyId, input.serviceId);

    return {
      success: true,
    };
  }
}

namespace UseCase {
  export type Input = {
    specialtyId: string;
    serviceId: string;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as UnlinkServiceFromSpecialtyUseCase };
