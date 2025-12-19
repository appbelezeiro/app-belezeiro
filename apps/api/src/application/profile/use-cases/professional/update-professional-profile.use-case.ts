import { IProfessionalProfileRepository } from '../../../../contracts/repositories/professional-profile.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { DisplayName } from '../../../../domain/profile/professional/value-objects/display-name.vo';
import { YearsOfExperience } from '../../../../domain/profile/professional/value-objects/years-experience.vo';
import { ProfileNotFoundError } from '../../../../domain/profile/errors/profile-not-found.error';

class UseCase {
  constructor(
    private readonly professionalProfileRepository: IProfessionalProfileRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const profile = await this.professionalProfileRepository.findById(
      input.professionalProfileId,
    );

    if (!profile) {
      throw new ProfileNotFoundError(input.professionalProfileId);
    }

    profile.updateProfile({
      displayName: input.displayName ? DisplayName.create(input.displayName) : undefined,
      bio: input.bio,
      yearsOfExperience: input.yearsOfExperience
        ? YearsOfExperience.create(input.yearsOfExperience)
        : undefined,
      achievements: input.achievements,
      specialties: input.specialties,
    });

    await this.professionalProfileRepository.save(profile);

    const events = profile.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      success: true,
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalProfileId: string;
    displayName?: string;
    bio?: string;
    yearsOfExperience?: number;
    achievements?: string[];
    specialties?: string[];
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as UpdateProfessionalProfileUseCase };
