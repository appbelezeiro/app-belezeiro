import { IBookingRepository } from '../../../contracts/repositories/booking.repository';
import { IEventBus } from '../../../contracts/events/i-event-bus';
import { Booking } from '../../../domain/booking/booking.aggregate';
import { InvalidAdvanceTimeError } from '../../../domain/booking/errors/invalid-advance-time.error';
import { DoubleBookingError } from '../../../domain/booking/errors/double-booking.error';
import { ServicesFromDifferentProfessionalError } from '../../../domain/booking/errors/services-from-different-professional.error';

class UseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly eventBus: IEventBus
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    // Validate all services belong to the same professional
    const uniqueProfessionals = new Set(
      input.services.map((s) => s.professionalProfileId)
    );
    if (uniqueProfessionals.size > 1) {
      throw new ServicesFromDifferentProfessionalError();
    }

    const professionalProfileId = input.services[0].professionalProfileId;

    // Validate minimum advance time
    const now = new Date();
    const minAdvanceMs = input.bookingRules.minAdvanceMinutes * 60 * 1000;
    if (input.startTime.getTime() - now.getTime() < minAdvanceMs) {
      throw new InvalidAdvanceTimeError(
        `Booking must be at least ${input.bookingRules.minAdvanceMinutes} minutes in advance`
      );
    }

    // Validate maximum advance days
    const maxAdvanceMs = input.bookingRules.maxAdvanceDays * 24 * 60 * 60 * 1000;
    if (input.startTime.getTime() - now.getTime() > maxAdvanceMs) {
      throw new InvalidAdvanceTimeError(
        `Booking cannot be more than ${input.bookingRules.maxAdvanceDays} days in advance`
      );
    }

    // Calculate total duration and end time
    const totalDuration = input.services.reduce((sum, s) => sum + s.duration, 0);
    const endTime = new Date(input.startTime.getTime() + totalDuration * 60 * 1000);

    // Check for conflicts
    const hasConflict = await this.bookingRepository.hasConflict(
      professionalProfileId,
      input.startTime,
      endTime
    );

    if (hasConflict) {
      throw new DoubleBookingError();
    }

    // Create booking
    const booking = Booking.create({
      professionalProfileId,
      customerProfileId: input.customerProfileId,
      startTime: input.startTime,
      endTime,
      totalDuration,
      services: input.services.map((s, index) => ({
        serviceId: s.serviceId,
        serviceName: s.serviceName,
        duration: s.duration,
        order: index,
      })),
    });

    await this.bookingRepository.save(booking);

    const events = booking.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      bookingId: booking.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    customerProfileId: string;
    startTime: Date;
    services: Array<{
      professionalProfileId: string;
      serviceId: string;
      serviceName: string;
      duration: number;
    }>;
    bookingRules: {
      minAdvanceMinutes: number;
      maxAdvanceDays: number;
    };
  };

  export type Output = {
    bookingId: string;
  };
}

export { UseCase as CreateBookingUseCase };
