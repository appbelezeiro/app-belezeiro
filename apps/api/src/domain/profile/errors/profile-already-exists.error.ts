import { DomainError } from '../../errors/base/domain-error';

export class ProfileAlreadyExistsError extends DomainError {
  constructor(userId: string, profileType: string) {
    super(
      `User ${userId} already has a ${profileType} profile`,
      'PROFILE_ALREADY_EXISTS',
    );
  }
}
