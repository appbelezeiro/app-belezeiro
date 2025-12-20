import { IAvailabilityRepository } from '../../../contracts/repositories/availability.repository';
import { IEventBus } from '../../../contracts/events/i-event-bus';
import { Availability } from '../../../domain/booking/availability.entity';

class UseCase {
  constructor(
    private readonly availabilityRepository: IAvailabilityRepository,
    private readonly eventBus: IEventBus
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const existing = await this.availabilityRepository.findByProfessionalAndDay(
      input.professionalProfileId,
      input.dayOfWeek
    );

    let availability: Availability;

    if (existing) {
      existing.update({
        startTime: input.startTime,
        endTime: input.endTime,
        isActive: input.isActive,
      });
      availability = existing;
    } else {
      availability = Availability.create({
        professionalProfileId: input.professionalProfileId,
        dayOfWeek: input.dayOfWeek,
        startTime: input.startTime,
        endTime: input.endTime,
        isActive: input.isActive,
      });
    }

    await this.availabilityRepository.upsert(availability);

    const events = availability.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      availabilityId: availability.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalProfileId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive?: boolean;
  };

  export type Output = {
    availabilityId: string;
  };
}

export { UseCase as SetAvailabilityUseCase };
