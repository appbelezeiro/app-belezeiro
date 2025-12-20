import { IUnitRepository } from '../../../../../contracts/repositories/unit.repository';
import { IOrganizationRepository } from '../../../../../contracts/repositories/organization.repository';
import { IProfessionalProfileRepository } from '../../../../../contracts/repositories/professional-profile.repository';
import { IOwnerProfileRepository } from '../../../../../contracts/repositories/owner-profile.repository';
import { IEventBus } from '../../../../../contracts/events/i-event-bus';
import { ProfessionalProfile } from '../../../../../domain/profile/professional/professional-profile.aggregate';
import { UnitProfessionalLink } from '../../../../../domain/organization/unit/unit-professional-link.entity';
import { DisplayName } from '../../../../../domain/profile/professional/value-objects/display-name.vo';
import { UnitNotFoundError } from '../../../../../domain/organization/errors/unit-not-found.error';

class UseCase {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly organizationRepository: IOrganizationRepository,
    private readonly professionalProfileRepository: IProfessionalProfileRepository,
    private readonly ownerProfileRepository: IOwnerProfileRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const unit = await this.unitRepository.findById(input.unitId);

    if (!unit) {
      throw new UnitNotFoundError(input.unitId);
    }

    const oldValue = unit.isSoloProfessional;
    const newValue = input.isSoloProfessional;

    if (oldValue === newValue) {
      return { success: true };
    }

    if (!oldValue && newValue) {
      const organization = await this.organizationRepository.findById(unit.organizationId);

      if (organization) {
        const ownerProfile = await this.ownerProfileRepository.findById(
          organization.ownerId,
        );

        if (ownerProfile) {
          let professionalProfile = await this.professionalProfileRepository.findByUserId(
            ownerProfile.userId,
          );

          if (!professionalProfile) {
            professionalProfile = ProfessionalProfile.create({
              userId: ownerProfile.userId,
              displayName: DisplayName.create(ownerProfile.userId),
              bio: undefined,
              yearsOfExperience: undefined,
              achievements: [],
              specialties: [],
            });

            await this.professionalProfileRepository.save(professionalProfile);

            const profEvents = professionalProfile.pullEvents();
            for (const event of profEvents) {
              await this.eventBus.publish(event);
            }
          }

          const link = UnitProfessionalLink.create({
            unitId: unit.id,
            professionalProfileId: professionalProfile.id,
            invitedBy: organization.ownerId,
          });

          link.activate();

          unit.setSoloProfessional(true, professionalProfile.id);
        }
      }
    } else if (oldValue && !newValue) {
      unit.setSoloProfessional(false);
    }

    await this.unitRepository.update(unit);

    const events = unit.pullEvents();
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
    unitId: string;
    isSoloProfessional: boolean;
  };

  export type Output = {
    success: boolean;
  };
}

export { UseCase as SetSoloProfessionalUseCase };
