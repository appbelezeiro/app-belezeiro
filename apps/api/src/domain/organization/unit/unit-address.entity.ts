import { BaseEntity, BaseEntityProps } from '../../entities/base/base-entity';

export interface UnitAddressProps extends BaseEntityProps {
  unitId: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export class UnitAddress extends BaseEntity<UnitAddressProps> {
  protected prefix(): string {
    return 'uaddr';
  }

  private constructor(props: UnitAddressProps) {
    super(props);
  }

  static create(data: {
    unitId: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }): UnitAddress {
    if (!data.unitId) {
      throw new Error('unitId is required');
    }

    return new UnitAddress({
      unitId: data.unitId,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country ?? 'Brasil',
      latitude: data.latitude,
      longitude: data.longitude,
    });
  }

  static reconstitute(data: {
    id: string;
    unitId: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    createdAt: Date;
    updatedAt: Date;
  }): UnitAddress {
    return new UnitAddress({
      id: data.id,
      unitId: data.unitId,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get unitId(): string {
    return this.props.unitId;
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

  get latitude(): number | undefined {
    return this.props.latitude;
  }

  get longitude(): number | undefined {
    return this.props.longitude;
  }

  update(data: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }): void {
    if (data.street !== undefined) this.props.street = data.street;
    if (data.number !== undefined) this.props.number = data.number;
    if (data.complement !== undefined) this.props.complement = data.complement;
    if (data.neighborhood !== undefined) this.props.neighborhood = data.neighborhood;
    if (data.city !== undefined) this.props.city = data.city;
    if (data.state !== undefined) this.props.state = data.state;
    if (data.zipCode !== undefined) this.props.zipCode = data.zipCode;
    if (data.country !== undefined) this.props.country = data.country;
    if (data.latitude !== undefined) this.props.latitude = data.latitude;
    if (data.longitude !== undefined) this.props.longitude = data.longitude;

    this.touch();
  }
}
