import { randomUUID } from 'node:crypto';

import { DomainEvent, DomainEventInput } from '../../events/base/domain-event';

export interface BaseEntityProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class BaseEntity<TProps extends BaseEntityProps = BaseEntityProps> {
  protected readonly _id: string;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;
  protected props: TProps;

  private _domainEvents: DomainEvent[] = [];
  private _eventVersion: number = 0;

  constructor(props: TProps) {
    const now = new Date();

    this._id = props.id ?? randomUUID();
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
    this._eventVersion += 1;

    const event: DomainEvent<TPayload> = {
      ...input,
      eventId: randomUUID(),
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
