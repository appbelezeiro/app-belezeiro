export class DoubleBookingError extends Error {
  constructor(message: string = 'Este horário conflita com outro agendamento') {
    super(message);
    this.name = 'DoubleBookingError';
  }
}
