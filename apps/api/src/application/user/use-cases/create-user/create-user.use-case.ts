import { IUserRepository } from '../../../../contracts/repositories/i-user.repository';
import { IEventBus } from '../../../../contracts/events/i-event-bus';
import { User } from '../../../../domain/user/user.aggregate';
import { ProviderType } from '../../../../domain/user/user-provider.entity';
import { Email } from '../../../../domain/value-objects/email.vo';
import { UserName, ProviderId } from '../../../../domain/user/value-objects';
import { URLAddress } from '../../../../domain/value-objects/url-address.vo';
import { EmailAlreadyExistsError } from '../../../../domain/user/user.errors';

/**
 * CreateUserUseCase
 *
 * Cria um novo usuário no sistema.
 *
 * Fluxo:
 * 1. Verifica se email já existe
 * 2. Cria User aggregate
 * 3. Persiste no repositório
 * 4. Publica eventos de domínio
 * 5. Retorna ID do usuário criado
 */
class UseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    // 1. Validar unicidade do email
    const email = new Email(input.email);

    const emailExists = await this.userRepository.existsByEmail(email);

    if (emailExists) {
      throw new EmailAlreadyExistsError(email.value);
    }

    // 2. Criar aggregate User
    const user = User.create({
      email,
      name: new UserName(input.name),
      photoUrl: input.photoUrl ? new URLAddress(input.photoUrl) : undefined,
      provider: input.provider as ProviderType,
      providerId: new ProviderId(input.providerId),
      providerEmail: input.providerEmail ? new Email(input.providerEmail) : undefined,
    });

    // 3. Persistir
    await this.userRepository.save(user);

    // 4. Publicar eventos
    const events = user.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    // 5. Retornar ID
    return {
      userId: user.id,
    };
  }
}

namespace UseCase {
  export type Input = {
    email: string;
    name: string;
    photoUrl?: string;
    provider: string; // 'google', 'facebook', 'email_password'
    providerId: string; // ID fornecido pelo provider
    providerEmail?: string; // Email do provider (pode diferir do email principal)
  };

  export type Output = {
    userId: string;
  };
}

export { UseCase as CreateUserUseCase };
