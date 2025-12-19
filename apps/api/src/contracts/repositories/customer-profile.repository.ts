import { CustomerProfile } from '../../domain/profile/customer/customer-profile.aggregate';

export interface ICustomerProfileRepository {
  findById(id: string): Promise<CustomerProfile | null>;
  findByUserId(userId: string): Promise<CustomerProfile | null>;
  save(profile: CustomerProfile): Promise<void>;
  delete(id: string): Promise<void>;
}
