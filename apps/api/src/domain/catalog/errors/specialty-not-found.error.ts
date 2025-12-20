import { DomainError } from '../../errors/base/domain-error';

export class SpecialtyNotFoundError extends DomainError {
  constructor(specialtyId: string) {
    super(`Specialty ${specialtyId} not found`, 'SPECIALTY_NOT_FOUND');
  }
}
