import { IOwnerProfileRepository } from '../../../../contracts/repositories/owner-profile.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { ProfileNotFoundError } from '../../../../domain/profile/errors/profile-not-found.error';

class UseCase {
  constructor(
    private readonly ownerProfileRepository: IOwnerProfileRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const profile = await this.ownerProfileRepository.findById(input.ownerProfileId);

    if (!profile) {
      throw new ProfileNotFoundError(input.ownerProfileId);
    }

    profile.updateProfile({
      education: input.education,
    });

    await this.ownerProfileRepository.save(profile);

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
    ownerProfileId: string;
    education?: string;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as UpdateOwnerProfileUseCase };
