import { User } from '../../../../domain/user/user.aggregate';
import { UserPhone } from '../../../../domain/user/user-phone.entity';
import { UserProvider } from '../../../../domain/user/user-provider.entity';
import { UserId, UserName, Gender } from '../../../../domain/user/value-objects';
import { Email } from '../../../../domain/value-objects/email.vo';
import { Document, DocumentType } from '../../../../domain/value-objects/document.vo';
import { URLAddress } from '../../../../domain/value-objects/url-address.vo';
import { UserRow, UserInsert } from '../schemas/users.schema';

/**
 * UserMapper
 *
 * Converte entre User (domínio) e UserRow (persistência)
 * Não inclui phones e providers (são mapeados separadamente)
 */
export class UserMapper {
  /**
   * Domain -> Persistence
   */
  static toPersistence(
    user: User,
  ): {
    user: UserInsert;
  } {
    return {
      user: {
        id: user.id,
        email: user.email?.value ?? null,
        name: user.name.value,
        document: user.document?.value ?? null,
        documentType: user.document?.type ?? null,
        birthDate: user.birthDate ? user.birthDate.toISOString().split('T')[0] : null,
        gender: user.gender?.value ?? null,
        photoUrl: user.photoUrl?.value ?? null,
        onboardingCompleted: user.onboardingCompleted,
        emailBeforeDeletion: user.emailBeforeDeletion?.value ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt ?? null,
      },
    };
  }

  /**
   * Persistence -> Domain
   * Requer phones e providers carregados separadamente
   */
  static toDomain(row: UserRow, phones: UserPhone[], providers: UserProvider[]): User {
    let document: Document | undefined;

    if (row.document && row.documentType) {
      if (row.documentType === DocumentType.CPF) {
        document = Document.fromCPF(row.document);
      } else if (row.documentType === DocumentType.CNPJ) {
        document = Document.fromCNPJ(row.document);
      }
    }

    return User.reconstitute({
      id: row.id,
      email: row.email ? new Email(row.email) : null,
      name: new UserName(row.name),
      document,
      birthDate: row.birthDate ? new Date(row.birthDate) : undefined,
      gender: row.gender ? new Gender(row.gender) : undefined,
      photoUrl: row.photoUrl ? new URLAddress(row.photoUrl) : undefined,
      phones,
      providers,
      onboardingCompleted: row.onboardingCompleted,
      emailBeforeDeletion: row.emailBeforeDeletion
        ? new Email(row.emailBeforeDeletion)
        : undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    });
  }
}
