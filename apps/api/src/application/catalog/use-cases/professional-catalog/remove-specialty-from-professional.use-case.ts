import { IProfessionalSpecialtyRepository } from '../../../../contracts/repositories/professional-specialty.repository';

class UseCase {
  constructor(
    private readonly professionalSpecialtyRepository: IProfessionalSpecialtyRepository,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    await this.professionalSpecialtyRepository.delete(input.professionalSpecialtyId);

    return {
      success: true,
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalSpecialtyId: string;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as RemoveSpecialtyFromProfessionalUseCase };
