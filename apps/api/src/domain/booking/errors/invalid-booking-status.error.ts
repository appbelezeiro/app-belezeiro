export class InvalidBookingStatusError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBookingStatusError';
  }
}
