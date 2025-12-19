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
