import { BaseEntity, BaseEntityProps } from '../entities/base/base-entity';
import { Phone } from '../value-objects/phone.vo';
import { UserPhoneId } from './value-objects';

export interface UserPhoneProps extends BaseEntityProps {
  userId: string;
  phone: Phone;
  label: string;
  isPrimary: boolean;
  isWhatsApp: boolean;
}

/**
 * UserPhone Entity
 *
 * Representa um telefone associado a um usuário.
 * - Cada user pode ter múltiplos telefones
 * - Apenas 1 pode ser primary
 * - Label: 'Celular', 'Trabalho', 'Casa', etc
 */
export class UserPhone extends BaseEntity<UserPhoneProps> {
  protected prefix(): string {
    return 'phone';
  }

  private constructor(props: UserPhoneProps) {
    super(props);
  }

  static create(data: {
    userId: string;
    phone: Phone;
    label: string;
    isPrimary: boolean;
    isWhatsApp: boolean;
  }): UserPhone {
    return new UserPhone({
      userId: data.userId,
      phone: data.phone,
      label: data.label,
      isPrimary: data.isPrimary,
      isWhatsApp: data.isWhatsApp,
    });
  }

  static reconstitute(data: {
    id: string;
    userId: string;
    phone: Phone;
    label: string;
    isPrimary: boolean;
    isWhatsApp: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): UserPhone {
    return new UserPhone({
      id: data.id,
      userId: data.userId,
      phone: data.phone,
      label: data.label,
      isPrimary: data.isPrimary,
      isWhatsApp: data.isWhatsApp,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get userId(): string {
    return this.props.userId;
  }

  get phone(): Phone {
    return this.props.phone;
  }

  get label(): string {
    return this.props.label;
  }

  get isPrimary(): boolean {
    return this.props.isPrimary;
  }

  get isWhatsApp(): boolean {
    return this.props.isWhatsApp;
  }

  markAsPrimary(): void {
    this.props.isPrimary = true;
    this.touch();
  }

  unmarkPrimary(): void {
    this.props.isPrimary = false;
    this.touch();
  }

  updateLabel(label: string): void {
    this.props.label = label;
    this.touch();
  }
}
