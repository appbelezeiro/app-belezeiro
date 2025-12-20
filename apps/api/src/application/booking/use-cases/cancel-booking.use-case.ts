import { IBookingRepository } from '../../../contracts/repositories/booking.repository';
import { IEventBus } from '../../../contracts/events/i-event-bus';
import { BookingNotFoundError } from '../../../domain/booking/errors/booking-not-found.error';

class UseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly eventBus: IEventBus
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const booking = await this.bookingRepository.findById(input.bookingId);

    if (!booking) {
      throw new BookingNotFoundError(input.bookingId);
    }

    booking.cancel(input.cancelledBy, input.cancellationReason);

    await this.bookingRepository.save(booking);

    const events = booking.pullEvents();
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
    bookingId: string;
    cancelledBy: 'customer' | 'professional';
    cancellationReason: string;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as CancelBookingUseCase };
