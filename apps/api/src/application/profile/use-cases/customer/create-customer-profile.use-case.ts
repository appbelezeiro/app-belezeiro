import { ICustomerProfileRepository } from '../../../../contracts/repositories/customer-profile.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { CustomerProfile } from '../../../../domain/profile/customer/customer-profile.aggregate';
import { ProfileAlreadyExistsError } from '../../../../domain/profile/errors/profile-already-exists.error';

class UseCase {
  constructor(
    private readonly customerProfileRepository: ICustomerProfileRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const existing = await this.customerProfileRepository.findByUserId(input.userId);

    if (existing) {
      throw new ProfileAlreadyExistsError(input.userId, 'CustomerProfile');
    }

    const profile = CustomerProfile.create({
      userId: input.userId,
      preferredServices: input.preferredServices,
      notes: input.notes,
    });

    await this.customerProfileRepository.save(profile);

    const events = profile.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      customerProfileId: profile.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    userId: string;
    preferredServices?: string[];
    notes?: string;
  };

  export type Output = {
    customerProfileId: string;
  };
}

export { UseCase as CreateCustomerProfileUseCase };
