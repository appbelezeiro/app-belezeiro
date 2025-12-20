import { DomainError } from '../../errors/base/domain-error';

export class InvalidServiceOwnershipError extends DomainError {
  constructor() {
    super(
      'Service cannot have both ownerId and unitId',
      'INVALID_SERVICE_OWNERSHIP',
    );
  }
}
