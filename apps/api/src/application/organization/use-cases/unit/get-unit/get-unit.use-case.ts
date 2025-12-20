import { IUnitRepository } from '../../../../../contracts/repositories/unit.repository';
import { Unit } from '../../../../../domain/organization/unit/unit.aggregate';

class UseCase {
  constructor(private readonly unitRepository: IUnitRepository) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    let unit: Unit | null = null;

    if (input.unitId) {
      unit = await this.unitRepository.findById(input.unitId);
    } else if (input.organizationId && input.slug) {
      unit = await this.unitRepository.findBySlug(input.organizationId, input.slug);
    }

    return {
      unit: unit ?? undefined,
    };
  }
}

namespace UseCase {
  export type Input = {
    unitId?: string;
    organizationId?: string;
    slug?: string;
  };

  export type Output = {
    unit?: Unit;
  };
}

export { UseCase as GetUnitUseCase };
