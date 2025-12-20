import { BaseEntity, BaseEntityProps } from '../../entities/base/base-entity';

export interface ProfessionalSpecialtyProps extends BaseEntityProps {
  professionalProfileId: string;
  specialtyId: string;
}

export class ProfessionalSpecialty extends BaseEntity<ProfessionalSpecialtyProps> {
  protected prefix(): string {
    return 'pspec';
  }

  private constructor(props: ProfessionalSpecialtyProps) {
    super(props);
  }

  static create(data: {
    professionalProfileId: string;
    specialtyId: string;
  }): ProfessionalSpecialty {
    return new ProfessionalSpecialty({
      professionalProfileId: data.professionalProfileId,
      specialtyId: data.specialtyId,
    });
  }

  static reconstitute(data: {
    id: string;
    professionalProfileId: string;
    specialtyId: string;
    createdAt: Date;
    updatedAt: Date;
  }): ProfessionalSpecialty {
    return new ProfessionalSpecialty({
      id: data.id,
      professionalProfileId: data.professionalProfileId,
      specialtyId: data.specialtyId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get professionalProfileId(): string {
    return this.props.professionalProfileId;
  }

  get specialtyId(): string {
    return this.props.specialtyId;
  }
}
