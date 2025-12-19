import { OwnerProfile } from '../../domain/profile/owner/owner-profile.aggregate';

export interface IOwnerProfileRepository {
  findById(id: string): Promise<OwnerProfile | null>;
  findByUserId(userId: string): Promise<OwnerProfile | null>;
  save(profile: OwnerProfile): Promise<void>;
  delete(id: string): Promise<void>;
}
