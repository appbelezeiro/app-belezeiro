import { IUnitRepository } from '../../../../../contracts/repositories/unit.repository';
import { IOrganizationRepository } from '../../../../../contracts/repositories/organization.repository';
import { IProfessionalProfileRepository } from '../../../../../contracts/repositories/professional-profile.repository';
import { IOwnerProfileRepository } from '../../../../../contracts/repositories/owner-profile.repository';
import { IEventBus } from '../../../../../contracts/events/i-event-bus';
import { Unit } from '../../../../../domain/organization/unit/unit.aggregate';
import { UnitAddress } from '../../../../../domain/organization/unit/unit-address.entity';
import { ProfessionalProfile } from '../../../../../domain/profile/professional/professional-profile.aggregate';
import { UnitProfessionalLink } from '../../../../../domain/organization/unit/unit-professional-link.entity';
import { DisplayName } from '../../../../../domain/profile/professional/value-objects/display-name.vo';
import { OrganizationNotFoundError } from '../../../../../domain/organization/errors/organization-not-found.error';
import { SlugAlreadyExistsError } from '../../../../../domain/organization/errors/slug-already-exists.error';

class UseCase {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly organizationRepository: IOrganizationRepository,
    private readonly professionalProfileRepository: IProfessionalProfileRepository,
    private readonly ownerProfileRepository: IOwnerProfileRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const organization = await this.organizationRepository.findById(input.organizationId);

    if (!organization) {
      throw new OrganizationNotFoundError(input.organizationId);
    }

    const existingUnit = await this.unitRepository.findBySlug(
      input.organizationId,
      input.slug,
    );

    if (existingUnit) {
      throw new SlugAlreadyExistsError(input.slug);
    }

    const unit = Unit.create({
      organizationId: input.organizationId,
      name: input.name,
      slug: input.slug,
      isSoloProfessional: input.isSoloProfessional,
      phone: input.phone,
      email: input.email,
    });

    const address = UnitAddress.create({
      unitId: unit.id,
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      neighborhood: input.address.neighborhood,
      city: input.address.city,
      state: input.address.state,
      zipCode: input.address.zipCode,
      country: input.address.country,
      latitude: input.address.latitude,
      longitude: input.address.longitude,
    });

    unit.setAddress(address);

    if (input.isSoloProfessional) {
      const ownerProfile = await this.ownerProfileRepository.findById(organization.ownerId);

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
      }
    }

    await this.unitRepository.create(unit);

    const events = unit.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return {
      unitId: unit.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    organizationId: string;
    name: string;
    slug: string;
    isSoloProfessional: boolean;
    phone?: string;
    email?: string;
    address: {
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
    };
  };

  export type Output = {
    unitId: string;
  };
}

export { UseCase as CreateUnitUseCase };
