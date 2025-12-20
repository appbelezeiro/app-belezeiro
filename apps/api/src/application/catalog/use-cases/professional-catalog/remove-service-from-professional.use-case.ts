import { IProfessionalServiceRepository } from '../../../../contracts/repositories/professional-service.repository';

class UseCase {
  constructor(
    private readonly professionalServiceRepository: IProfessionalServiceRepository,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    await this.professionalServiceRepository.delete(input.professionalServiceId);

    return {
      success: true,
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalServiceId: string;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as RemoveServiceFromProfessionalUseCase };
