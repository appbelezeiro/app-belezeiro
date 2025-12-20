import { BaseEntity, BaseEntityProps } from '../../entities/base/base-entity';

export interface ProfessionalServiceProps extends BaseEntityProps {
  professionalProfileId: string;
  serviceId: string;
  customPrice?: number;
  customDuration?: number;
  isActive: boolean;
}

export class ProfessionalService extends BaseEntity<ProfessionalServiceProps> {
  protected prefix(): string {
    return 'ps';
  }

  private constructor(props: ProfessionalServiceProps) {
    super(props);
  }

  static create(data: {
    professionalProfileId: string;
    serviceId: string;
    customPrice?: number;
    customDuration?: number;
    isActive?: boolean;
  }): ProfessionalService {
    return new ProfessionalService({
      professionalProfileId: data.professionalProfileId,
      serviceId: data.serviceId,
      customPrice: data.customPrice,
      customDuration: data.customDuration,
      isActive: data.isActive ?? true,
    });
  }

  static reconstitute(data: {
    id: string;
    professionalProfileId: string;
    serviceId: string;
    customPrice?: number;
    customDuration?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): ProfessionalService {
    return new ProfessionalService({
      id: data.id,
      professionalProfileId: data.professionalProfileId,
      serviceId: data.serviceId,
      customPrice: data.customPrice,
      customDuration: data.customDuration,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get professionalProfileId(): string {
    return this.props.professionalProfileId;
  }

  get serviceId(): string {
    return this.props.serviceId;
  }

  get customPrice(): number | undefined {
    return this.props.customPrice;
  }

  get customDuration(): number | undefined {
    return this.props.customDuration;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  updatePrice(price: number | undefined): void {
    this.props.customPrice = price;
    this.touch();
  }

  updateDuration(duration: number | undefined): void {
    this.props.customDuration = duration;
    this.touch();
  }

  activate(): void {
    this.props.isActive = true;
    this.touch();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }
}
