import { UserPhone } from '../../../../domain/user/user-phone.entity';
import { Phone } from '../../../../domain/value-objects/phone.vo';
import { UserPhoneRow, UserPhoneInsert } from '../schemas/user-phones.schema';

/**
 * UserPhoneMapper
 *
 * Converte entre UserPhone (domínio) e UserPhoneRow (persistência)
 */
export class UserPhoneMapper {
  /**
   * Domain -> Persistence
   */
  static toPersistence(userPhone: UserPhone): UserPhoneInsert {
    return {
      id: userPhone.id,
      userId: userPhone.userId,
      countryCode: userPhone.phone.countryCode,
      areaCode: userPhone.phone.areaCode,
      number: userPhone.phone.number,
      label: userPhone.label,
      isPrimary: userPhone.isPrimary,
      isWhatsApp: userPhone.isWhatsApp,
      createdAt: userPhone.createdAt,
      updatedAt: userPhone.updatedAt,
    };
  }

  /**
   * Persistence -> Domain
   */
  static toDomain(row: UserPhoneRow): UserPhone {
    const phone = Phone.create(`${row.countryCode}${row.areaCode}${row.number}`);

    return UserPhone.reconstitute({
      id: row.id,
      userId: row.userId,
      phone,
      label: row.label || '',
      isPrimary: row.isPrimary,
      isWhatsApp: row.isWhatsApp,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
