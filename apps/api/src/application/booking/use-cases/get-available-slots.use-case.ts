import { IAvailabilityRepository } from '../../../contracts/repositories/availability.repository';
import { IBookingRepository } from '../../../contracts/repositories/booking.repository';
import { TimeSlot } from '../../../domain/booking/value-objects/time-slot.vo';

class UseCase {
  constructor(
    private readonly availabilityRepository: IAvailabilityRepository,
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const { professionalProfileId, date, serviceDuration, slotDuration, bufferMinutes } =
      input;

    // 1. Get day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = date.getDay();

    // 2. Get professional availability for the day
    const availability = await this.availabilityRepository.findByProfessionalAndDay(
      professionalProfileId,
      dayOfWeek
    );

    if (!availability || !availability.isActive) {
      return { slots: [] };
    }

    // 3. Parse working hours
    const workingHours = availability.getWorkingHours();
    const [startHour, startMinute] = workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = workingHours.end.split(':').map(Number);

    const dayStart = new Date(date);
    dayStart.setHours(startHour, startMinute, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(endHour, endMinute, 0, 0);

    // 4. Generate all possible slots
    const allSlots: TimeSlot[] = [];
    let currentSlotStart = dayStart;

    while (currentSlotStart < dayEnd) {
      const slotEnd = new Date(currentSlotStart.getTime() + slotDuration * 60 * 1000);

      if (slotEnd <= dayEnd) {
        const slot = TimeSlot.create(currentSlotStart, slotEnd);

        // Check if slot has enough time for the service
        if (slot.duration() >= serviceDuration) {
          allSlots.push(slot);
        }
      }

      currentSlotStart = new Date(currentSlotStart.getTime() + slotDuration * 60 * 1000);
    }

    // 5. Get existing bookings for the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await this.bookingRepository.findByProfessional(
      professionalProfileId,
      {
        status: 'confirmed',
        startDate: startOfDay,
        endDate: endOfDay,
      }
    );

    // 6. Filter out occupied slots
    const availableSlots = allSlots.filter((slot) => {
      for (const booking of bookings) {
        // Create a buffered time slot for the booking
        const bookingStart = new Date(
          booking.startTime.getTime() - bufferMinutes * 60 * 1000
        );
        const bookingEnd = new Date(
          booking.endTime.getTime() + bufferMinutes * 60 * 1000
        );

        const bufferedBookingSlot = TimeSlot.create(bookingStart, bookingEnd);

        // Check if slot would need serviceDuration + buffer
        const serviceEnd = new Date(
          slot.getStart().getTime() + serviceDuration * 60 * 1000
        );
        const serviceSlot = TimeSlot.create(slot.getStart(), serviceEnd);

        if (serviceSlot.overlaps(bufferedBookingSlot)) {
          return false;
        }
      }

      return true;
    });

    // 7. Filter out slots in the past
    const now = new Date();
    const futureSlots = availableSlots.filter((slot) => slot.getStart() > now);

    return {
      slots: futureSlots.map((slot) => ({
        startTime: slot.getStart(),
        endTime: slot.getEnd(),
      })),
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalProfileId: string;
    date: Date;
    serviceDuration: number;
    slotDuration: number;
    bufferMinutes: number;
  };

  export type Output = {
    slots: Array<{
      startTime: Date;
      endTime: Date;
    }>;
  };
}

export { UseCase as GetAvailableSlotsUseCase };
