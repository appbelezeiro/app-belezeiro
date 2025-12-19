import { ICustomerProfileRepository } from '../../../../contracts/repositories/customer-profile.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { AddressLabel } from '../../../../domain/profile/customer/value-objects/address-label.vo';
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

    profile.addAddress({
      street: input.street,
      number: input.number,
      complement: input.complement,
      neighborhood: input.neighborhood,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      country: input.country,
      label: AddressLabel.create(input.label),
      latitude: input.latitude,
      longitude: input.longitude,
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
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    label: string;
    latitude?: number;
    longitude?: number;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as AddCustomerAddressUseCase };
