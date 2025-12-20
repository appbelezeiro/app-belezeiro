import { IProfessionalProfileRepository } from '../../../contracts/repositories/professional-profile.repository';
import { ProfileNotFoundError } from '../../../domain/profile/errors/profile-not-found.error';

class UseCase {
  constructor(
    private readonly professionalProfileRepository: IProfessionalProfileRepository
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const profile = await this.professionalProfileRepository.findById(
      input.professionalProfileId
    );

    if (!profile) {
      throw new ProfileNotFoundError(input.professionalProfileId);
    }

    const bookingRules = profile.getBookingRules();

    return {
      bookingRules: {
        slotDurationMinutes: bookingRules.slotDurationMinutes,
        minAdvanceMinutes: bookingRules.minAdvanceMinutes,
        maxAdvanceDays: bookingRules.maxAdvanceDays,
        bufferMinutes: bookingRules.bufferMinutes,
      },
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalProfileId: string;
  };

  export type Output = {
    bookingRules: {
      slotDurationMinutes: number;
      minAdvanceMinutes: number;
      maxAdvanceDays: number;
      bufferMinutes: number;
    };
  };
}

export { UseCase as GetBookingRulesUseCase };
