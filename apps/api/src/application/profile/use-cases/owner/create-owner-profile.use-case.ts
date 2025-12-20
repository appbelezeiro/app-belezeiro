import { IOwnerProfileRepository } from '../../../../contracts/repositories/owner-profile.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { OwnerProfile } from '../../../../domain/profile/owner/owner-profile.aggregate';
import { ProfileAlreadyExistsError } from '../../../../domain/profile/errors/profile-already-exists.error';

class UseCase {
  constructor(
    private readonly ownerProfileRepository: IOwnerProfileRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const existing = await this.ownerProfileRepository.findByUserId(input.userId);

    if (existing) {
      throw new ProfileAlreadyExistsError(input.userId, 'OwnerProfile');
    }

    const profile = OwnerProfile.create({
      userId: input.userId,
      education: input.education,
    });

    await this.ownerProfileRepository.save(profile);

    const events = profile.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      ownerProfileId: profile.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    userId: string;
    education?: string;
  };

  export type Output = {
    ownerProfileId: string;
  };
}

export { UseCase as CreateOwnerProfileUseCase };
