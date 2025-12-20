import { DomainError } from '../../errors/base/domain-error';

export class UnitNotFoundError extends DomainError {
  constructor(unitId: string) {
    super(`Unit ${unitId} not found`, 'UNIT_NOT_FOUND');
  }
}
