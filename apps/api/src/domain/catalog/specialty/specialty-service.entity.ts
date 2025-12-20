export interface SpecialtyServiceProps {
  specialtyId: string;
  serviceId: string;
}

export class SpecialtyService {
  constructor(
    public readonly specialtyId: string,
    public readonly serviceId: string,
  ) {}

  static create(data: SpecialtyServiceProps): SpecialtyService {
    return new SpecialtyService(data.specialtyId, data.serviceId);
  }
}
