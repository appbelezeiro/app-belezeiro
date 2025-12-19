import { IProfessionalProfileRepository } from '../../../../contracts/repositories/professional-profile.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { ProfessionalProfile } from '../../../../domain/profile/professional/professional-profile.aggregate';
import { DisplayName } from '../../../../domain/profile/professional/value-objects/display-name.vo';
import { YearsOfExperience } from '../../../../domain/profile/professional/value-objects/years-experience.vo';
import { ProfileAlreadyExistsError } from '../../../../domain/profile/errors/profile-already-exists.error';

class UseCase {
  constructor(
    private readonly professionalProfileRepository: IProfessionalProfileRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const existing = await this.professionalProfileRepository.findByUserId(input.userId);

    if (existing) {
      throw new ProfileAlreadyExistsError(input.userId, 'ProfessionalProfile');
    }

    const profile = ProfessionalProfile.create({
      userId: input.userId,
      displayName: DisplayName.create(input.displayName),
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
      professionalProfileId: profile.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    userId: string;
    displayName: string;
    bio?: string;
    yearsOfExperience?: number;
    achievements?: string[];
    specialties?: string[];
  };

  export type Output = {
    professionalProfileId: string;
  };
}

export { UseCase as CreateProfessionalProfileUseCase };
