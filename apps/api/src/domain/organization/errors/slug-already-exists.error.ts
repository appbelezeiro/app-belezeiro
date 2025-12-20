import { DomainError } from '../../errors/base/domain-error';

export class SlugAlreadyExistsError extends DomainError {
  constructor(slug: string) {
    super(`Slug ${slug} already exists`, 'SLUG_ALREADY_EXISTS');
  }
}
