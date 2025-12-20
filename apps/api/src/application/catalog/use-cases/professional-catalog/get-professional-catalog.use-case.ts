import { IProfessionalServiceRepository } from '../../../../contracts/repositories/professional-service.repository';
import { IServiceRepository } from '../../../../contracts/repositories/service.repository';
import { ISpecialtyRepository } from '../../../../contracts/repositories/specialty.repository';

class UseCase {
  constructor(
    private readonly professionalServiceRepository: IProfessionalServiceRepository,
    private readonly serviceRepository: IServiceRepository,
    private readonly specialtyRepository: ISpecialtyRepository,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const [professionalServices, specialties] = await Promise.all([
      this.professionalServiceRepository.findByProfessionalId(input.professionalProfileId),
      this.specialtyRepository.findByProfessionalId(input.professionalProfileId),
    ]);

    const serviceIds = professionalServices.map((ps) => ps.serviceId);
    const services = await Promise.all(
      serviceIds.map((id) => this.serviceRepository.findById(id)),
    );

    const servicesMap = new Map(
      services.filter((s) => s !== null).map((s) => [s!.id, s!]),
    );

    return {
      specialties: specialties.map((specialty) => ({
        id: specialty.id,
        name: specialty.name,
        description: specialty.description,
        icon: specialty.icon,
      })),
      services: professionalServices.map((ps) => {
        const service = servicesMap.get(ps.serviceId);
        return {
          id: ps.id,
          serviceId: ps.serviceId,
          serviceName: service?.name ?? '',
          customPrice: ps.customPrice,
          customDuration: ps.customDuration,
          defaultPrice: service?.defaultPrice,
          defaultDuration: service?.defaultDuration,
          isActive: ps.isActive,
        };
      }),
    };
  }
}

namespace UseCase {
  export type Input = {
    professionalProfileId: string;
  };

  export type Output = {
    specialties: Array<{
      id: string;
      name: string;
      description?: string;
      icon?: string;
    }>;
    services: Array<{
      id: string;
      serviceId: string;
      serviceName: string;
      customPrice?: number;
      customDuration?: number;
      defaultPrice?: number;
      defaultDuration?: number;
      isActive: boolean;
    }>;
  };
}

export { UseCase as GetProfessionalCatalogUseCase };
