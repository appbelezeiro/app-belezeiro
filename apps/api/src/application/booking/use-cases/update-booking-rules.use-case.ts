import { IProfessionalProfileRepository } from '../../../contracts/repositories/professional-profile.repository';
import { IEventBus } from '../../../contracts/events/i-event-bus';
import { ProfileNotFoundError } from '../../../domain/profile/errors/profile-not-found.error';

class UseCase {
  constructor(
    private readonly professionalProfileRepository: IProfessionalProfileRepository,
    private readonly eventBus: IEventBus
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const profile = await this.professionalProfileRepository.findById(
      input.professionalProfileId
    );

    if (!profile) {
      throw new ProfileNotFoundError(input.professionalProfileId);
    }

    profile.updateBookingRules({
      slotDurationMinutes: input.slotDurationMinutes,
      minAdvanceMinutes: input.minAdvanceMinutes,
      maxAdvanceDays: input.maxAdvanceDays,
      bufferMinutes: input.bufferMinutes,
    });

    await this.professionalProfileRepository.save(profile);

    const events = profile.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      success: true,
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalProfileId: string;
    slotDurationMinutes?: number;
    minAdvanceMinutes?: number;
    maxAdvanceDays?: number;
    bufferMinutes?: number;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as UpdateBookingRulesUseCase };
