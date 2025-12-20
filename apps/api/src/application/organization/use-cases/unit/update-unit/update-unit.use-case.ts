import { IUnitRepository } from '../../../../../contracts/repositories/unit.repository';
import { IEventBus } from '../../../../../contracts/events/i-event-bus';
import { UnitNotFoundError } from '../../../../../domain/organization/errors/unit-not-found.error';
import { SlugAlreadyExistsError } from '../../../../../domain/organization/errors/slug-already-exists.error';

class UseCase {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const unit = await this.unitRepository.findById(input.unitId);

    if (!unit) {
      throw new UnitNotFoundError(input.unitId);
    }

    if (input.slug && input.slug !== unit.slug) {
      const existing = await this.unitRepository.findBySlug(unit.organizationId, input.slug);
      if (existing) {
        throw new SlugAlreadyExistsError(input.slug);
      }
    }

    unit.update({
      name: input.name,
      slug: input.slug,
      phone: input.phone,
      email: input.email,
    });

    if (input.address && unit.address) {
      unit.address.update({
        street: input.address.street,
        number: input.address.number,
        complement: input.address.complement,
        neighborhood: input.address.neighborhood,
        city: input.address.city,
        state: input.address.state,
        zipCode: input.address.zipCode,
        country: input.address.country,
        latitude: input.address.latitude,
        longitude: input.address.longitude,
      });
    }

    await this.unitRepository.update(unit);

    const events = unit.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      unitId: unit.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    unitId: string;
    name?: string;
    slug?: string;
    phone?: string;
    email?: string;
    address?: {
      street?: string;
      number?: string;
      complement?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    };
  };

  export type Output = {
    unitId: string;
  };
}

export { UseCase as UpdateUnitUseCase };
