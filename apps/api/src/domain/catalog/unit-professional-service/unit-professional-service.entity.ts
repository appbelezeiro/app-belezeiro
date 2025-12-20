import { BaseEntity, BaseEntityProps } from '../../entities/base/base-entity';
import { ProfessionalService } from '../professional-catalog/professional-service.entity';
import { Service } from '../service/service.aggregate';

export interface UnitProfessionalServiceProps extends BaseEntityProps {
  unitProfessionalLinkId: string;
  serviceId: string;
  unitPrice?: number;
  unitDuration?: number;
  isActive: boolean;
}

export class UnitProfessionalService extends BaseEntity<UnitProfessionalServiceProps> {
  protected prefix(): string {
    return 'ups';
  }

  private constructor(props: UnitProfessionalServiceProps) {
    super(props);
  }

  static create(data: {
    unitProfessionalLinkId: string;
    serviceId: string;
    unitPrice?: number;
    unitDuration?: number;
    isActive?: boolean;
  }): UnitProfessionalService {
    return new UnitProfessionalService({
      unitProfessionalLinkId: data.unitProfessionalLinkId,
      serviceId: data.serviceId,
      unitPrice: data.unitPrice,
      unitDuration: data.unitDuration,
      isActive: data.isActive ?? true,
    });
  }

  static reconstitute(data: {
    id: string;
    unitProfessionalLinkId: string;
    serviceId: string;
    unitPrice?: number;
    unitDuration?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): UnitProfessionalService {
    return new UnitProfessionalService({
      id: data.id,
      unitProfessionalLinkId: data.unitProfessionalLinkId,
      serviceId: data.serviceId,
      unitPrice: data.unitPrice,
      unitDuration: data.unitDuration,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get unitProfessionalLinkId(): string {
    return this.props.unitProfessionalLinkId;
  }

  get serviceId(): string {
    return this.props.serviceId;
  }

  get unitPrice(): number | undefined {
    return this.props.unitPrice;
  }

  get unitDuration(): number | undefined {
    return this.props.unitDuration;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  setUnitPrice(price: number | undefined): void {
    this.props.unitPrice = price;
    this.touch();
  }

  setUnitDuration(duration: number | undefined): void {
    this.props.unitDuration = duration;
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

  resolvePrice(
    professionalService: ProfessionalService | null,
    service: Service,
  ): number {
    if (this.props.unitPrice !== undefined && this.props.unitPrice !== null) {
      return this.props.unitPrice;
    }

    if (professionalService?.customPrice !== undefined && professionalService.customPrice !== null) {
      return professionalService.customPrice;
    }

    if (service.defaultPrice !== undefined && service.defaultPrice !== null) {
      return service.defaultPrice;
    }

    return 0;
  }

  resolveDuration(
    professionalService: ProfessionalService | null,
    service: Service,
  ): number {
    if (this.props.unitDuration !== undefined && this.props.unitDuration !== null) {
      return this.props.unitDuration;
    }

    if (professionalService?.customDuration !== undefined && professionalService.customDuration !== null) {
      return professionalService.customDuration;
    }

    if (service.defaultDuration !== undefined && service.defaultDuration !== null) {
      return service.defaultDuration;
    }

    return 0;
  }
}
