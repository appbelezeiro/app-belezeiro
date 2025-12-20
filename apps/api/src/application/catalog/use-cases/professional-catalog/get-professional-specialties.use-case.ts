import { ISpecialtyRepository } from '../../../../contracts/repositories/specialty.repository';

class UseCase {
  constructor(private readonly specialtyRepository: ISpecialtyRepository) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const specialties = await this.specialtyRepository.findByProfessionalId(
      input.professionalProfileId,
    );

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
  export type Input = {
    professionalProfileId: string;
  };

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

export { UseCase as GetProfessionalSpecialtiesUseCase };
