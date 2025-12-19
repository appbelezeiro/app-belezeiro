import { AggregateRoot, BaseEntityProps } from '../../entities/base/aggregate-root';
import { OwnerProfileEvents } from './owner-profile.events';

export interface OwnerProfileProps extends BaseEntityProps {
  userId: string;
  education?: string;
}

export class OwnerProfile extends AggregateRoot<OwnerProfileProps> {
  get aggregateType(): string {
    return 'OwnerProfile';
  }

  protected prefix(): string {
    return 'owner';
  }

  private constructor(props: OwnerProfileProps) {
    super(props);
  }

  static create(data: { userId: string; education?: string }): OwnerProfile {
    const profile = new OwnerProfile({
      userId: data.userId,
      education: data.education,
    });

    profile.raise({
      eventType: OwnerProfileEvents.OwnerProfileCreated,
      aggregateId: profile.id,
      aggregateType: 'OwnerProfile',
      payload: {
        ownerProfileId: profile.id,
        userId: data.userId,
      },
    });

    return profile;
  }

  static reconstitute(data: {
    id: string;
    userId: string;
    education?: string;
    createdAt: Date;
    updatedAt: Date;
  }): OwnerProfile {
    return new OwnerProfile({
      id: data.id,
      userId: data.userId,
      education: data.education,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get userId(): string {
    return this.props.userId;
  }

  get education(): string | undefined {
    return this.props.education;
  }

  updateProfile(data: { education?: string }): void {
    if (data.education !== undefined) {
      this.props.education = data.education;
    }

    this.touch();

    this.raise({
      eventType: OwnerProfileEvents.OwnerProfileUpdated,
      aggregateId: this.id,
      aggregateType: 'OwnerProfile',
      payload: {
        ownerProfileId: this.id,
      },
    });
  }
}
