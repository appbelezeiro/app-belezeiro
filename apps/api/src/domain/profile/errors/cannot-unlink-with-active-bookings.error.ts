import { DomainError } from '../../errors/base/domain-error';

export class CannotUnlinkWithActiveBookingsError extends DomainError {
  constructor() {
    super(
      'Cannot unlink professional with active bookings',
      'CANNOT_UNLINK_WITH_ACTIVE_BOOKINGS',
    );
  }
}
