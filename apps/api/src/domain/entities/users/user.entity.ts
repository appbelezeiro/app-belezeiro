import { AggregateRoot, BaseEntityProps } from '../base';

export interface UserProps extends BaseEntityProps {
  name: string;
  email: string;
}

/**
 * Exemplo de entidade User usando a nova arquitetura
 *
 * Features implementadas:
 * - ID com prefix: user_<uuid>
 * - EventIds com prefix: evt_<uuid>
 * - IdGenerator injetado via BaseEntity.configure()
 * - Método prefix() obrigatório
 */
export class User extends AggregateRoot<UserProps> {
  get aggregateType(): string {
    return 'User';
  }

  /**
   * Prefix do ID da entidade (máximo 5 caracteres)
   * IDs gerados terão o formato: user_<uuid>
   */
  protected prefix(): string {
    return 'user';
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    const user = new User(props);

    // Exemplo de evento de domínio
    user.raiseEvent('UserCreated', {
      name: props.name,
      email: props.email,
    });

    return user;
  }

  updateName(name: string): void {
    this.props.name = name;
    this.touch();

    this.raiseEvent('UserNameUpdated', {
      name,
    });
  }
}
