import { IUserRepository } from '../../../../contracts/repositories/i-user.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { UserId } from '../../../../domain/user/value-objects';
import { UserNotFoundError } from '../../../../domain/user/user.errors';

/**
 * DeleteUserUseCase
 *
 * Soft delete de usuário.
 *
 * Fluxo:
 * 1. Busca usuário
 * 2. Aplica soft delete (libera email, marca deletedAt)
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
    const user = await this.userRepository.findById(new UserId(input.userId));

    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    // 2. Soft delete
    user.softDelete();

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
  };

  export type Output = void;
}

export { UseCase as DeleteUserUseCase };
