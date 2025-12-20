import { DomainError } from '../../errors/base/domain-error';

export class ProfileNotFoundError extends DomainError {
  constructor(profileId: string) {
    super(`Profile ${profileId} not found`, 'PROFILE_NOT_FOUND');
  }
}
