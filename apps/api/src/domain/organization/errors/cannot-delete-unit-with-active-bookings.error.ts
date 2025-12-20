import { DomainError } from '../../errors/base/domain-error';

export class CannotDeleteUnitWithActiveBookingsError extends DomainError {
  constructor(unitId: string) {
    super(
      `Cannot delete unit ${unitId} with active bookings`,
      'CANNOT_DELETE_UNIT_WITH_ACTIVE_BOOKINGS',
    );
  }
}
