import { DomainEvent, DomainEventInput } from '../../events/base/domain-event';
import { IdGenerator } from '../../services/id-generator';

export interface BaseEntityProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Configuração global para BaseEntity
 * Objeto extensível para futuras configurações
 */
export interface BaseEntityConfig {
  idGenerator: IdGenerator;
}

export abstract class BaseEntity<TProps extends BaseEntityProps = BaseEntityProps> {
  protected readonly _id: string;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;
  protected props: TProps;

  private _domainEvents: DomainEvent[] = [];
  private _eventVersion: number = 0;

  private static config: BaseEntityConfig | null = null;

  /**
   * Configura o comportamento global de BaseEntity
   * Deve ser chamado uma vez na inicialização da aplicação
   */
  static configure(config: BaseEntityConfig): void {
    BaseEntity.config = config;
  }

  /**
   * Retorna o prefixo do ID da entidade (máximo 5 caracteres)
   * Será concatenado com o ID gerado: prefix_id
   */
  protected abstract prefix(): string;

  constructor(props: TProps) {
    if (!BaseEntity.config) {
      throw new Error(
        'BaseEntity não foi configurado. Chame BaseEntity.configure() antes de criar entidades.',
      );
    }

    const now = new Date();

    // Gera ID com prefix se não fornecido: prefix_id
    this._id = props.id ?? BaseEntity.config.idGenerator.generate(this.prefix());
    this._createdAt = props.createdAt ?? now;
    this._updatedAt = props.updatedAt ?? now;
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  // ─────────────────────────────────────────────────────────────
  // Domain Events
  // ─────────────────────────────────────────────────────────────

  get domainEvents(): ReadonlyArray<DomainEvent> {
    return [...this._domainEvents];
  }

  protected raise<TPayload>(input: DomainEventInput<TPayload>): void {
    if (!BaseEntity.config) {
      throw new Error(
        'BaseEntity não foi configurado. Chame BaseEntity.configure() antes de criar entidades.',
      );
    }

    this._eventVersion += 1;

    const event: DomainEvent<TPayload> = {
      ...input,
      eventId: BaseEntity.config.idGenerator.generate('evt'),
      occurredAt: new Date(),
      version: this._eventVersion,
    };

    this._domainEvents.push(event);
  }

  pullEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  clearEvents(): void {
    this._domainEvents = [];
  }

  // ─────────────────────────────────────────────────────────────
  // Equality
  // ─────────────────────────────────────────────────────────────

  equals(other: BaseEntity): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (this === other) {
      return true;
    }

    return this._id === other._id;
  }
}
