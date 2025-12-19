import { IUserRepository } from '../../../../contracts/repositories/i-user.repository';
import { UserNotFoundError } from '../../../../domain/user/user.errors';

/**
 * GetUserUseCase
 *
 * Busca um usuário por ID.
 *
 * Fluxo:
 * 1. Busca usuário no repositório
 * 2. Se não encontrar, lança erro
 * 3. Retorna DTO completo do usuário
 */
class UseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UseCase.Input): Promise<UseCase.Output> {
    // 1. Buscar usuário
    const user = await this.userRepository.findById(input.userId);

    // 2. Validar existência
    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    // 3. Retornar DTO
    return {
      id: user.id,
      email: user.email?.value ?? null,
      name: user.name.value,
      cpf: user.cpf
        ? {
            value: user.cpf.value,
            formatted: user.cpf.toFormatted(),
          }
        : undefined,
      birthDate: user.birthDate,
      gender: user.gender?.value,
      photoUrl: user.photoUrl?.value,
      phones: user.phones.map((phone) => ({
        id: phone.id,
        phone: phone.phone.toFormatted(),
        label: phone.label,
        isPrimary: phone.isPrimary,
        isWhatsApp: phone.isWhatsApp,
      })),
      providers: user.providers.map((provider) => ({
        id: provider.id,
        provider: provider.provider,
        providerId: provider.providerId.value,
        providerEmail: provider.providerEmail?.value,
        linkedAt: provider.linkedAt,
        lastUsedAt: provider.lastUsedAt,
      })),
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
}

namespace UseCase {
  export type Input = {
    userId: string;
  };

  export type Output = {
    id: string;
    email: string | null;
    name: string;
    cpf?: {
      value: string;
      formatted: string;
    };
    birthDate?: Date;
    gender?: string;
    photoUrl?: string;
    phones: Array<{
      id: string;
      phone: string;
      label: string;
      isPrimary: boolean;
      isWhatsApp: boolean;
    }>;
    providers: Array<{
      id: string;
      provider: string;
      providerId: string;
      providerEmail?: string;
      linkedAt: Date;
      lastUsedAt: Date;
    }>;
    onboardingCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  };
}

export { UseCase as GetUserUseCase };
