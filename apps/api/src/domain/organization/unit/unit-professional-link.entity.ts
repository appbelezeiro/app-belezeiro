import { BaseEntity, BaseEntityProps } from '../../entities/base/base-entity';

export enum UnitProfessionalLinkStatus {
  Pending = 'pending',
  Active = 'active',
  Inactive = 'inactive',
}

export interface UnitProfessionalLinkProps extends BaseEntityProps {
  unitId: string;
  professionalProfileId: string;
  status: UnitProfessionalLinkStatus;
  invitedBy: string;
  invitedAt: Date;
  linkedAt?: Date;
  unlinkedAt?: Date;
}

export class UnitProfessionalLink extends BaseEntity<UnitProfessionalLinkProps> {
  protected prefix(): string {
    return 'upl';
  }

  private constructor(props: UnitProfessionalLinkProps) {
    super(props);
  }

  static create(data: {
    unitId: string;
    professionalProfileId: string;
    invitedBy: string;
  }): UnitProfessionalLink {
    return new UnitProfessionalLink({
      unitId: data.unitId,
      professionalProfileId: data.professionalProfileId,
      status: UnitProfessionalLinkStatus.Pending,
      invitedBy: data.invitedBy,
      invitedAt: new Date(),
    });
  }

  static reconstitute(data: {
    id: string;
    unitId: string;
    professionalProfileId: string;
    status: UnitProfessionalLinkStatus;
    invitedBy: string;
    invitedAt: Date;
    linkedAt?: Date;
    unlinkedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }): UnitProfessionalLink {
    return new UnitProfessionalLink({
      id: data.id,
      unitId: data.unitId,
      professionalProfileId: data.professionalProfileId,
      status: data.status,
      invitedBy: data.invitedBy,
      invitedAt: data.invitedAt,
      linkedAt: data.linkedAt,
      unlinkedAt: data.unlinkedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get unitId(): string {
    return this.props.unitId;
  }

  get professionalProfileId(): string {
    return this.props.professionalProfileId;
  }

  get status(): UnitProfessionalLinkStatus {
    return this.props.status;
  }

  get invitedBy(): string {
    return this.props.invitedBy;
  }

  get invitedAt(): Date {
    return this.props.invitedAt;
  }

  get linkedAt(): Date | undefined {
    return this.props.linkedAt;
  }

  get unlinkedAt(): Date | undefined {
    return this.props.unlinkedAt;
  }

  activate(): void {
    this.props.status = UnitProfessionalLinkStatus.Active;
    this.props.linkedAt = new Date();
    this.touch();
  }

  deactivate(): void {
    this.props.status = UnitProfessionalLinkStatus.Inactive;
    this.props.unlinkedAt = new Date();
    this.touch();
  }

  reactivate(): void {
    this.props.status = UnitProfessionalLinkStatus.Active;
    this.props.linkedAt = new Date();
    this.props.unlinkedAt = undefined;
    this.touch();
  }
}
