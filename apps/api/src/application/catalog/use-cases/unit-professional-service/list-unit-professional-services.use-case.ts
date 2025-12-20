import { IUnitProfessionalServiceRepository } from '../../../../contracts/repositories/unit-professional-service.repository';

class UseCase {
  constructor(
    private readonly unitProfessionalServiceRepository: IUnitProfessionalServiceRepository,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const services = await this.unitProfessionalServiceRepository.findByUnitProfessionalLinkId(
      input.unitProfessionalLinkId,
    );

    return {
      services: services.map((service) => ({
        id: service.id,
        unitProfessionalLinkId: service.unitProfessionalLinkId,
        serviceId: service.serviceId,
        unitPrice: service.unitPrice,
        unitDuration: service.unitDuration,
        isActive: service.isActive,
      })),
    };
  }
}

namespace UseCase {
  export type Input = {
    unitProfessionalLinkId: string;
  };

  export type Output = {
    services: Array<{
      id: string;
      unitProfessionalLinkId: string;
      serviceId: string;
      unitPrice?: number;
      unitDuration?: number;
      isActive: boolean;
    }>;
  };
}

export { UseCase as ListUnitProfessionalServicesUseCase };
