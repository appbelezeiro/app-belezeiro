import { IProfessionalSpecialtyRepository } from '../../../../contracts/repositories/professional-specialty.repository';
import { ISpecialtyRepository } from '../../../../contracts/repositories/specialty.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { ProfessionalSpecialty } from '../../../../domain/catalog/professional-catalog/professional-specialty.entity';
import { SpecialtyNotFoundError } from '../../../../domain/catalog/specialty/specialty.errors';

class UseCase {
  constructor(
    private readonly professionalSpecialtyRepository: IProfessionalSpecialtyRepository,
    private readonly specialtyRepository: ISpecialtyRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const specialty = await this.specialtyRepository.findById(input.specialtyId);
    if (!specialty) {
      throw new SpecialtyNotFoundError(input.specialtyId);
    }

    const exists = await this.professionalSpecialtyRepository.exists(
      input.professionalProfileId,
      input.specialtyId,
    );

    if (exists) {
      return { success: true };
    }

    const professionalSpecialty = ProfessionalSpecialty.create({
      professionalProfileId: input.professionalProfileId,
      specialtyId: input.specialtyId,
    });

    await this.professionalSpecialtyRepository.create(professionalSpecialty);

    return {
      success: true,
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalProfileId: string;
    specialtyId: string;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as AddSpecialtyToProfessionalUseCase };
