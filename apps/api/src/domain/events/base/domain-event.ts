export interface DomainEventMetadata {
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly userId?: string;
}

export interface DomainEvent<TPayload = unknown> {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly occurredAt: Date;
  readonly payload: TPayload;
  readonly metadata?: DomainEventMetadata;
  readonly version: number;
}

export type DomainEventInput<TPayload = unknown> = Omit<
  DomainEvent<TPayload>,
  'eventId' | 'occurredAt' | 'version'
>;

/**
 * Classe abstrata base para Domain Events
 *
 * Facilita a criação de eventos de domínio concretos.
 * Os eventos são criados automaticamente pelo AggregateRoot.raiseEvent()
 * com eventId, occurredAt e version preenchidos.
 */
export abstract class BaseDomainEvent<TPayload = unknown> implements DomainEvent<TPayload> {
  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly payload: TPayload,
    public readonly occurredAt: Date,
    public readonly version: number,
    public readonly metadata?: DomainEventMetadata,
  ) {}

  /**
   * Tipo do evento (ex: 'user.created', 'user.deleted')
   * Deve ser implementado pelas classes concretas
   */
  abstract get eventType(): string;
}
