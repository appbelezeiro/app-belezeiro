import { AggregateRoot, BaseEntityProps } from '../../entities/base/aggregate-root';
import { CustomerAddress } from './customer-address.entity';
import { AddressLabel } from './value-objects/address-label.vo';
import { CustomerProfileEvents } from './customer-profile.events';

export interface CustomerProfileProps extends BaseEntityProps {
  userId: string;
  preferredServices: string[];
  notes?: string;
  addresses: CustomerAddress[];
}

export class CustomerProfile extends AggregateRoot<CustomerProfileProps> {
  get aggregateType(): string {
    return 'CustomerProfile';
  }

  protected prefix(): string {
    return 'cust';
  }

  private constructor(props: CustomerProfileProps) {
    super(props);
  }

  static create(data: {
    userId: string;
    preferredServices?: string[];
    notes?: string;
  }): CustomerProfile {
    const profile = new CustomerProfile({
      userId: data.userId,
      preferredServices: data.preferredServices ?? [],
      notes: data.notes,
      addresses: [],
    });

    profile.raise({
      eventType: CustomerProfileEvents.CustomerProfileCreated,
      aggregateId: profile.id,
      aggregateType: 'CustomerProfile',
      payload: {
        customerProfileId: profile.id,
        userId: data.userId,
      },
    });

    return profile;
  }

  static reconstitute(data: {
    id: string;
    userId: string;
    preferredServices: string[];
    notes?: string;
    addresses: CustomerAddress[];
    createdAt: Date;
    updatedAt: Date;
  }): CustomerProfile {
    return new CustomerProfile({
      id: data.id,
      userId: data.userId,
      preferredServices: data.preferredServices,
      notes: data.notes,
      addresses: data.addresses,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get userId(): string {
    return this.props.userId;
  }

  get preferredServices(): readonly string[] {
    return this.props.preferredServices;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get addresses(): readonly CustomerAddress[] {
    return this.props.addresses;
  }

  addAddress(data: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    label: AddressLabel;
    latitude?: number;
    longitude?: number;
  }): void {
    const isPrimary = this.props.addresses.length === 0;

    const address = CustomerAddress.create({
      customerProfileId: this.id,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      label: data.label,
      isPrimary,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    this.props.addresses.push(address);
    this.touch();

    this.raise({
      eventType: CustomerProfileEvents.CustomerAddressAdded,
      aggregateId: this.id,
      aggregateType: 'CustomerProfile',
      payload: {
        customerProfileId: this.id,
        addressId: address.id,
        isPrimary,
      },
    });
  }

  removeAddress(addressId: string): void {
    const index = this.props.addresses.findIndex((a) => a.id === addressId);

    if (index === -1) {
      throw new Error(`Address ${addressId} not found`);
    }

    this.props.addresses.splice(index, 1);
    this.touch();

    this.raise({
      eventType: CustomerProfileEvents.CustomerAddressRemoved,
      aggregateId: this.id,
      aggregateType: 'CustomerProfile',
      payload: {
        customerProfileId: this.id,
        addressId,
      },
    });
  }

  setPrimaryAddress(addressId: string): void {
    const address = this.props.addresses.find((a) => a.id === addressId);

    if (!address) {
      throw new Error(`Address ${addressId} not found`);
    }

    const oldPrimary = this.props.addresses.find((a) => a.isPrimary);

    this.props.addresses.forEach((a) => a.unmarkPrimary());
    address.markAsPrimary();
    this.touch();

    this.raise({
      eventType: CustomerProfileEvents.CustomerAddressPrimaryChanged,
      aggregateId: this.id,
      aggregateType: 'CustomerProfile',
      payload: {
        customerProfileId: this.id,
        oldPrimaryAddressId: oldPrimary?.id,
        newPrimaryAddressId: addressId,
      },
    });
  }

  updateProfile(data: { preferredServices?: string[]; notes?: string }): void {
    if (data.preferredServices !== undefined) {
      this.props.preferredServices = data.preferredServices;
    }

    if (data.notes !== undefined) {
      this.props.notes = data.notes;
    }

    this.touch();

    this.raise({
      eventType: CustomerProfileEvents.CustomerProfileUpdated,
      aggregateId: this.id,
      aggregateType: 'CustomerProfile',
      payload: {
        customerProfileId: this.id,
      },
    });
  }
}
