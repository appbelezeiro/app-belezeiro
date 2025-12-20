import { IBookingRepository } from '../../../contracts/repositories/booking.repository';
import { BookingNotFoundError } from '../../../domain/booking/errors/booking-not-found.error';

class UseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const booking = await this.bookingRepository.findById(input.bookingId);

    if (!booking) {
      throw new BookingNotFoundError(input.bookingId);
    }

    return {
      booking: {
        id: booking.id,
        professionalProfileId: booking.professionalProfileId,
        customerProfileId: booking.customerProfileId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalDuration: booking.totalDuration,
        status: booking.status,
        cancelledBy: booking.cancelledBy,
        cancellationReason: booking.cancellationReason,
        cancelledAt: booking.cancelledAt,
        services: booking.services.map((s) => ({
          id: s.id,
          serviceId: s.serviceId,
          serviceName: s.serviceName,
          duration: s.duration,
          order: s.order,
        })),
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      },
    };
  }
}

namespace UseCase {
  export type Input = {
    bookingId: string;
  };

  export type Output = {
    booking: {
      id: string;
      professionalProfileId: string;
      customerProfileId: string;
      startTime: Date;
      endTime: Date;
      totalDuration: number;
      status: string;
      cancelledBy?: 'customer' | 'professional';
      cancellationReason?: string;
      cancelledAt?: Date;
      services: Array<{
        id: string;
        serviceId: string;
        serviceName: string;
        duration: number;
        order: number;
      }>;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

export { UseCase as GetBookingUseCase };
