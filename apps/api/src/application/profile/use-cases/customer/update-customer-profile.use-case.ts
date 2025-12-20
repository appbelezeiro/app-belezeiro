import { ICustomerProfileRepository } from '../../../../contracts/repositories/customer-profile.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { ProfileNotFoundError } from '../../../../domain/profile/errors/profile-not-found.error';

class UseCase {
  constructor(
    private readonly customerProfileRepository: ICustomerProfileRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const profile = await this.customerProfileRepository.findById(input.customerProfileId);

    if (!profile) {
      throw new ProfileNotFoundError(input.customerProfileId);
    }

    profile.updateProfile({
      preferredServices: input.preferredServices,
      notes: input.notes,
    });

    await this.customerProfileRepository.save(profile);

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
    customerProfileId: string;
    preferredServices?: string[];
    notes?: string;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as UpdateCustomerProfileUseCase };
