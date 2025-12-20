export class CancellationReasonRequiredError extends Error {
  constructor() {
    super('Cancellation reason is required');
    this.name = 'CancellationReasonRequiredError';
  }
}
