import { DomainError } from '../../errors/base/domain-error';

export class CannotDeleteOrgWithActiveUnitsError extends DomainError {
  constructor(organizationId: string) {
    super(
      `Cannot delete organization ${organizationId} with active units`,
      'CANNOT_DELETE_ORG_WITH_ACTIVE_UNITS',
    );
  }
}
