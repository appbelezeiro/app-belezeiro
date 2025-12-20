import { IUnitRepository } from '../../../../../contracts/repositories/unit.repository';
import { Unit } from '../../../../../domain/organization/unit/unit.aggregate';

class UseCase {
  constructor(private readonly unitRepository: IUnitRepository) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const units = await this.unitRepository.findByOrganizationId(input.organizationId);

    const activeUnits = units.filter((unit) => !unit.isDeleted());

    return {
      units: activeUnits,
    };
  }
}

namespace UseCase {
  export type Input = {
    organizationId: string;
  };

  export type Output = {
    units: Unit[];
  };
}

export { UseCase as ListOrganizationUnitsUseCase };
