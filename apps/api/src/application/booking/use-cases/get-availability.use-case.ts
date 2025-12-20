import { IAvailabilityRepository } from '../../../contracts/repositories/availability.repository';

class UseCase {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const availabilities = await this.availabilityRepository.findByProfessional(
      input.professionalProfileId
    );

    return {
      availabilities: availabilities.map((a) => ({
        id: a.id,
        professionalProfileId: a.professionalProfileId,
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
        isActive: a.isActive,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalProfileId: string;
  };

  export type Output = {
    availabilities: Array<{
      id: string;
      professionalProfileId: string;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
}

export { UseCase as GetAvailabilityUseCase };
