export class CancellationReason {
  private readonly value: string;

  constructor(reason: string) {
    if (!reason || reason.trim().length === 0) {
      throw new Error('Cancellation reason is required');
    }
    this.value = reason.trim();
  }

  getValue(): string {
    return this.value;
  }
}
