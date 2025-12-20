export enum BookingStatus {
  Confirmed = 'confirmed',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export class BookingStatusVO {
  constructor(private readonly value: BookingStatus) {}

  canTransitionTo(newStatus: BookingStatus): boolean {
    if (this.value === BookingStatus.Confirmed) {
      return newStatus === BookingStatus.Completed || newStatus === BookingStatus.Cancelled;
    }
    return false;
  }

  getValue(): BookingStatus {
    return this.value;
  }

  equals(other: BookingStatusVO): boolean {
    return this.value === other.value;
  }

  isConfirmed(): boolean {
    return this.value === BookingStatus.Confirmed;
  }

  isCompleted(): boolean {
    return this.value === BookingStatus.Completed;
  }

  isCancelled(): boolean {
    return this.value === BookingStatus.Cancelled;
  }
}
