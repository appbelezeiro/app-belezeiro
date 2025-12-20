export class BookingNotFoundError extends Error {
  constructor(bookingId: string) {
    super(`Booking not found: ${bookingId}`);
    this.name = 'BookingNotFoundError';
  }
}
