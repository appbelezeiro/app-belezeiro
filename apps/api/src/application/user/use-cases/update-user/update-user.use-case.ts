import { IUserRepository } from '../../../../contracts/repositories/i-user.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { UserName, Gender } from '../../../../domain/user/value-objects';
import { CPF } from '../../../../domain/value-objects/cpf.vo';
import { URLAddress } from '../../../../domain/value-objects/url-address.vo';
import { UserNotFoundError } from '../../../../domain/user/user.errors';

/**
 * UpdateUserUseCase
 *
 * Atualiza dados do usuário.
 *
 * Fluxo:
 * 1. Busca usuário
 * 2. Aplica mudanças (name, birthDate, gender, photoUrl, document)
 * 3. Persiste
 * 4. Publica eventos
 */
class UseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    // 1. Buscar usuário
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    // 2. Aplicar mudanças
    if (input.name) {
      user.updateName(new UserName(input.name));
    }

    if (input.birthDate) {
      user.updateBirthDate(new Date(input.birthDate));
    }

    if (input.gender) {
      user.updateGender(new Gender(input.gender));
    }

    if (input.photoUrl) {
      user.updatePhotoUrl(new URLAddress(input.photoUrl));
    }

    if (input.cpf) {
      // CPF é imutável - só pode ser definido uma vez
      user.setCPF(CPF.create(input.cpf));
    }

    // 3. Persistir
    await this.userRepository.save(user);

    // 4. Publicar eventos
    const events = user.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }
  }
}

namespace UseCase {
  export type Input = {
    userId: string;
    name?: string;
    birthDate?: string; // ISO 8601 string
    gender?: string;
    photoUrl?: string;
    cpf?: string; // CPF (apenas dígitos ou formatado)
  };

  export type Output = void;
}

export { UseCase as UpdateUserUseCase };
