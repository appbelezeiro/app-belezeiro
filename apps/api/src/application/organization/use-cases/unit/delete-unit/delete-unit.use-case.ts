import { IUnitRepository } from '../../../../../contracts/repositories/unit.repository';
import { IEventBus } from '../../../../../contracts/events/i-event-bus';
import { UnitNotFoundError } from '../../../../../domain/organization/errors/unit-not-found.error';
import { CannotDeleteUnitWithActiveBookingsError } from '../../../../../domain/organization/errors/cannot-delete-unit-with-active-bookings.error';

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

    const hasActiveBookings = await this.unitRepository.hasActiveBookings(input.unitId);

    if (!unit.canDelete(hasActiveBookings)) {
      throw new CannotDeleteUnitWithActiveBookingsError(input.unitId);
    }

    await this.unitRepository.softDelete(input.unitId);

    unit.softDelete();

    const events = unit.pullEvents();
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
    unitId: string;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as DeleteUnitUseCase };
