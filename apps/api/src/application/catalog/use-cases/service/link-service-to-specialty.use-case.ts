import { SpecialtyService } from '../../../../domain/catalog/specialty/specialty-service.entity';
import { SpecialtyServiceRepository } from '../../../../infra/database/drizzle/repositories/specialty-service.repository';
import { ISpecialtyRepository } from '../../../../contracts/repositories/specialty.repository';
import { IServiceRepository } from '../../../../contracts/repositories/service.repository';
import { SpecialtyNotFoundError } from '../../../../domain/catalog/specialty/specialty.errors';
import { ServiceNotFoundError } from '../../../../domain/catalog/service/service.errors';

class UseCase {
  constructor(
    private readonly specialtyRepository: ISpecialtyRepository,
    private readonly serviceRepository: IServiceRepository,
    private readonly specialtyServiceRepository: SpecialtyServiceRepository,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const specialty = await this.specialtyRepository.findById(input.specialtyId);
    if (!specialty) {
      throw new SpecialtyNotFoundError(input.specialtyId);
    }

    const service = await this.serviceRepository.findById(input.serviceId);
    if (!service) {
      throw new ServiceNotFoundError(input.serviceId);
    }

    const exists = await this.specialtyServiceRepository.exists(
      input.specialtyId,
      input.serviceId,
    );

    if (exists) {
      return { success: true };
    }

    const specialtyService = SpecialtyService.create({
      specialtyId: input.specialtyId,
      serviceId: input.serviceId,
    });

    await this.specialtyServiceRepository.create(specialtyService);

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

export { UseCase as LinkServiceToSpecialtyUseCase };
