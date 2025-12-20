import { DomainError } from '../../errors/base/domain-error';

export class OrganizationNotFoundError extends DomainError {
  constructor(organizationId: string) {
    super(`Organization ${organizationId} not found`, 'ORGANIZATION_NOT_FOUND');
  }
}
