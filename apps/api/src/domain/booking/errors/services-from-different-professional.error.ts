export class ServicesFromDifferentProfessionalError extends Error {
  constructor() {
    super('All services must belong to the same professional');
    this.name = 'ServicesFromDifferentProfessionalError';
  }
}
