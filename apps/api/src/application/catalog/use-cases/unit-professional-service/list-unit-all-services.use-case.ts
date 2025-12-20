import { IUnitProfessionalServiceRepository } from '../../../../contracts/repositories/unit-professional-service.repository';
import { IServiceRepository } from '../../../../contracts/repositories/service.repository';
import { IProfessionalServiceRepository } from '../../../../contracts/repositories/professional-service.repository';

class UseCase {
  constructor(
    private readonly unitProfessionalServiceRepository: IUnitProfessionalServiceRepository,
    private readonly serviceRepository: IServiceRepository,
    private readonly professionalServiceRepository: IProfessionalServiceRepository,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    const unitProfessionalServices =
      await this.unitProfessionalServiceRepository.findByUnitId(input.unitId);

    const serviceIds = [...new Set(unitProfessionalServices.map((ups) => ups.serviceId))];
    const services = await Promise.all(
      serviceIds.map((id) => this.serviceRepository.findById(id)),
    );

    const servicesMap = new Map(
      services.filter((s) => s !== null).map((s) => [s!.id, s!]),
    );

    return {
      services: unitProfessionalServices.map((ups) => {
        const service = servicesMap.get(ups.serviceId);
        return {
          id: ups.id,
          unitProfessionalLinkId: ups.unitProfessionalLinkId,
          serviceId: ups.serviceId,
          serviceName: service?.name ?? '',
          unitPrice: ups.unitPrice,
          unitDuration: ups.unitDuration,
          defaultPrice: service?.defaultPrice,
          defaultDuration: service?.defaultDuration,
          isActive: ups.isActive,
        };
      }),
    };
  }
}

namespace UseCase {
  export type Input = {
    unitId: string;
  };

  export type Output = {
    services: Array<{
      id: string;
      unitProfessionalLinkId: string;
      serviceId: string;
      serviceName: string;
      unitPrice?: number;
      unitDuration?: number;
      defaultPrice?: number;
      defaultDuration?: number;
      isActive: boolean;
    }>;
  };
}

export { UseCase as ListUnitAllServicesUseCase };
