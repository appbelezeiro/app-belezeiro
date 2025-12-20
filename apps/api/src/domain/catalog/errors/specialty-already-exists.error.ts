import { DomainError } from '../../errors/base/domain-error';

export class SpecialtyAlreadyExistsError extends DomainError {
  constructor(professionalProfileId: string, specialtyId: string) {
    super(
      `Specialty ${specialtyId} already exists for professional ${professionalProfileId}`,
      'SPECIALTY_ALREADY_EXISTS',
    );
  }
}
