import { DomainError } from '../../errors/base/domain-error';

export class ServiceNotFoundError extends DomainError {
  constructor(serviceId: string) {
    super(`Service ${serviceId} not found`, 'SERVICE_NOT_FOUND');
  }
}
