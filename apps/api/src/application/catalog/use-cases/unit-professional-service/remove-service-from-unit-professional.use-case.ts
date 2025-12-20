import { IUnitProfessionalServiceRepository } from '../../../../contracts/repositories/unit-professional-service.repository';

class UseCase {
  constructor(
    private readonly unitProfessionalServiceRepository: IUnitProfessionalServiceRepository,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    await this.unitProfessionalServiceRepository.delete(input.unitProfessionalServiceId);

    return {
      success: true,
    };
  }
}

namespace UseCase {
  export type Input = {
    unitProfessionalServiceId: string;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as RemoveServiceFromUnitProfessionalUseCase };
