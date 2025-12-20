import { DomainError } from '../../errors/base/domain-error';

export class ServiceAlreadyExistsError extends DomainError {
  constructor(professionalProfileId: string, serviceId: string) {
    super(
      `Service ${serviceId} already exists for professional ${professionalProfileId}`,
      'SERVICE_ALREADY_EXISTS',
    );
  }
}
