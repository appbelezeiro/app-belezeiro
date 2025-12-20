import { ISpecialtyRepository } from '../../../../contracts/repositories/specialty.repository';
import { Specialty } from '../../../../domain/catalog/specialty/specialty.aggregate';

class UseCase {
  constructor(private readonly specialtyRepository: ISpecialtyRepository) {}

  async execute(): Promise<UseCase.Output> {
    const specialties = await this.specialtyRepository.findGlobal();

    return {
      specialties: specialties.map((specialty) => ({
        id: specialty.id,
        name: specialty.name,
        description: specialty.description,
        icon: specialty.icon,
        isGlobal: specialty.isGlobal,
      })),
    };
  }
}

namespace UseCase {
  export type Output = {
    specialties: Array<{
      id: string;
      name: string;
      description?: string;
      icon?: string;
      isGlobal: boolean;
    }>;
  };
}

export { UseCase as ListGlobalSpecialtiesUseCase };
