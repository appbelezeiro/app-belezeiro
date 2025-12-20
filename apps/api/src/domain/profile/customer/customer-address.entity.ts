import { BaseEntity, BaseEntityProps } from '../../entities/base/base-entity';
import { AddressLabel } from './value-objects/address-label.vo';

export interface CustomerAddressProps extends BaseEntityProps {
  customerProfileId: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  label: AddressLabel;
  isPrimary: boolean;
  latitude?: number;
  longitude?: number;
}

export class CustomerAddress extends BaseEntity<CustomerAddressProps> {
  protected prefix(): string {
    return 'addr';
  }

  private constructor(props: CustomerAddressProps) {
    super(props);
  }

  static create(data: {
    customerProfileId: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    label: AddressLabel;
    isPrimary: boolean;
    latitude?: number;
    longitude?: number;
  }): CustomerAddress {
    if (!data.customerProfileId) {
      throw new Error('customerProfileId is required');
    }

    return new CustomerAddress({
      customerProfileId: data.customerProfileId,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      label: data.label,
      isPrimary: data.isPrimary,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  }

  static reconstitute(data: {
    id: string;
    customerProfileId: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    label: AddressLabel;
    isPrimary: boolean;
    latitude?: number;
    longitude?: number;
    createdAt: Date;
    updatedAt: Date;
  }): CustomerAddress {
    return new CustomerAddress({
      id: data.id,
      customerProfileId: data.customerProfileId,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      label: data.label,
      isPrimary: data.isPrimary,
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get customerProfileId(): string {
    return this.props.customerProfileId;
  }

  get street(): string {
    return this.props.street;
  }

  get number(): string {
    return this.props.number;
  }

  get complement(): string | undefined {
    return this.props.complement;
  }

  get neighborhood(): string {
    return this.props.neighborhood;
  }

  get city(): string {
    return this.props.city;
  }

  get state(): string {
    return this.props.state;
  }

  get zipCode(): string {
    return this.props.zipCode;
  }

  get country(): string {
    return this.props.country;
  }

  get label(): AddressLabel {
    return this.props.label;
  }

  get isPrimary(): boolean {
    return this.props.isPrimary;
  }

  get latitude(): number | undefined {
    return this.props.latitude;
  }

  get longitude(): number | undefined {
    return this.props.longitude;
  }

  markAsPrimary(): void {
    this.props.isPrimary = true;
    this.touch();
  }

  unmarkPrimary(): void {
    this.props.isPrimary = false;
    this.touch();
  }
}
