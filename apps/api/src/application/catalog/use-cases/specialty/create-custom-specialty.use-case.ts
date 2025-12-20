import { ISpecialtyRepository } from '../../../../contracts/repositories/specialty.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { Specialty } from '../../../../domain/catalog/specialty/specialty.aggregate';

class UseCase {
  constructor(
    private readonly specialtyRepository: ISpecialtyRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const specialty = Specialty.createCustom({
      professionalProfileId: input.professionalProfileId,
      name: input.name,
      description: input.description,
      icon: input.icon,
    });

    await this.specialtyRepository.create(specialty);

    const events = specialty.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      specialtyId: specialty.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalProfileId: string;
    name: string;
    description?: string;
    icon?: string;
  };

  export type Output = {
    specialtyId: string;
  };
}

export { UseCase as CreateCustomSpecialtyUseCase };
