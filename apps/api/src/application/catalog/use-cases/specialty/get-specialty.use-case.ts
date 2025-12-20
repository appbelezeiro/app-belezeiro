import { ISpecialtyRepository } from '../../../../contracts/repositories/specialty.repository';
import { SpecialtyNotFoundError } from '../../../../domain/catalog/specialty/specialty.errors';

class UseCase {
  constructor(private readonly specialtyRepository: ISpecialtyRepository) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const specialty = await this.specialtyRepository.findById(input.specialtyId);

    if (!specialty) {
      throw new SpecialtyNotFoundError(input.specialtyId);
    }

    return {
      specialty: {
        id: specialty.id,
        name: specialty.name,
        description: specialty.description,
        icon: specialty.icon,
        isGlobal: specialty.isGlobal,
        ownerId: specialty.ownerId,
        createdAt: specialty.createdAt,
        updatedAt: specialty.updatedAt,
      },
    };
  }
}

namespace UseCase {
  export type Input = {
    specialtyId: string;
  };

  export type Output = {
    specialty: {
      id: string;
      name: string;
      description?: string;
      icon?: string;
      isGlobal: boolean;
      ownerId?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

export { UseCase as GetSpecialtyUseCase };
