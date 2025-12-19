# Geração de IDs de Entidades

## Visão Geral

Este documento descreve a arquitetura de geração de IDs para entidades no domínio, seguindo princípios de Clean Architecture e DDD.

## Princípios

### 1. Separação de Responsabilidades
- **Domínio**: Define a interface `IdGenerator` (abstração)
- **Infraestrutura**: Implementa geradores concretos (ex: `UuidIdGenerator`, `UlidGenerator`)
- **Entidades**: Usam o gerador injetado, sem conhecer a implementação

### 2. Dependency Inversion
A camada de domínio **não importa** `node:crypto` ou qualquer biblioteca externa. Ela define apenas a interface que precisa, e a infraestrutura fornece a implementação.

```
Domain (Interface IdGenerator)
    ↑
    | depende
    |
Infrastructure (UuidIdGenerator implements IdGenerator)
```

### 3. Prefixos Obrigatórios
Todas as entidades devem implementar o método `prefix()` que retorna uma string de até 5 caracteres. Isso torna os IDs:
- **Auto-descritivos**: `user_abc123` é claramente um user
- **Debugáveis**: Fácil identificar tipo da entidade nos logs
- **Consistentes**: Padrão único em todo o sistema

## Formato de IDs

### IDs de Entidade
```
{prefix}_{id}
```

Exemplos:
- `user_550e8400-e29b-41d4-a716-446655440000`
- `org_7c9e6679-7425-40de-944b-e07fc1f90ae7`
- `prof_a1b2c3d4-e5f6-4789-0abc-def012345678`

### IDs de Eventos
```
evt_{id}
```

Exemplo:
- `evt_550e8400-e29b-41d4-a716-446655440000`

## Estrutura de Código

### Domain Service

```typescript
// domain/services/id-generator.ts
export interface IdGenerator {
  generate(): string;
}
```

### Configuração da BaseEntity

```typescript
// domain/entities/base/base-entity.ts
export interface BaseEntityConfig {
  idGenerator: IdGenerator;
  // Objeto extensível para futuras configurações
}

export abstract class BaseEntity<TProps> {
  private static config: BaseEntityConfig | null = null;

  static configure(config: BaseEntityConfig): void {
    BaseEntity.config = config;
  }

  protected abstract prefix(): string;
}
```

### Implementação na Infraestrutura

```typescript
// infra/services/uuid-id-generator.ts
import { randomUUID } from 'node:crypto';
import { IdGenerator } from '../../domain/services/id-generator';

export class UuidIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
```

### Exemplo de Entidade

```typescript
// domain/entities/users/user.entity.ts
export class User extends AggregateRoot<UserProps> {
  protected prefix(): string {
    return 'user'; // Máximo 5 caracteres
  }

  get aggregateType(): string {
    return 'User';
  }

  // IDs gerados: user_<uuid>
}
```

## Uso

### 1. Configuração Inicial (Bootstrap)

```typescript
// main.ts ou bootstrap
import { BaseEntity } from './domain/entities/base';
import { UuidIdGenerator } from './infra/services';

// IMPORTANTE: Chamar antes de criar qualquer entidade
BaseEntity.configure({
  idGenerator: new UuidIdGenerator(),
});
```

### 2. Criando Entidades

```typescript
import { User } from './domain/entities/users';

const user = User.create({
  name: 'João Silva',
  email: 'joao@example.com'
});

console.log(user.id);
// Output: user_550e8400-e29b-41d4-a716-446655440000
```

### 3. Eventos de Domínio

```typescript
const events = user.pullEvents();
console.log(events[0].eventId);
// Output: evt_7c9e6679-7425-40de-944b-e07fc1f90ae7
```

## Validações

### Configuração Obrigatória
Se tentar criar uma entidade sem configurar o BaseEntity primeiro:

```typescript
const user = new User({ name: 'João', email: 'joao@example.com' });
// Error: BaseEntity não foi configurado. Chame BaseEntity.configure() antes de criar entidades.
```

### Método prefix() Obrigatório
Todas as classes que estendem `BaseEntity` ou `AggregateRoot` **devem** implementar:

```typescript
protected prefix(): string {
  return 'user'; // Até 5 caracteres
}
```

## Extensibilidade

### Objeto de Configuração Extensível
O `BaseEntityConfig` é um objeto, permitindo adicionar novas configurações no futuro sem quebrar código existente:

```typescript
// Futuro
BaseEntity.configure({
  idGenerator: new UuidIdGenerator(),
  timezone: 'America/Sao_Paulo',
  enableAudit: true,
  logger: customLogger,
});
```

### Múltiplos Geradores
Você pode facilmente trocar a estratégia de geração:

```typescript
// UUID v4
BaseEntity.configure({
  idGenerator: new UuidIdGenerator(),
});

// ULID
BaseEntity.configure({
  idGenerator: new UlidGenerator(),
});

// Nanoid
BaseEntity.configure({
  idGenerator: new NanoidGenerator(),
});
```

## Benefícios

1. **Clean Architecture**: Domínio independente de infraestrutura
2. **Testabilidade**: Fácil mockar o `IdGenerator` em testes
3. **Flexibilidade**: Trocar UUID por ULID, Nanoid, etc sem tocar no domínio
4. **Consistência**: Prefixos obrigatórios garantem padrão único
5. **Debugabilidade**: IDs auto-descritivos facilitam troubleshooting
6. **Extensibilidade**: Objeto de configuração permite crescimento futuro
7. **Type Safety**: TypeScript garante implementação correta

## Prefixos Recomendados

| Entidade | Prefix | Exemplo de ID |
|----------|--------|---------------|
| User | `user` | `user_550e8400-e29b-...` |
| Organization | `org` | `org_7c9e6679-7425-...` |
| Profile | `prof` | `prof_a1b2c3d4-e5f6-...` |
| Unit | `unit` | `unit_9f8e7d6c-5b4a-...` |
| Booking | `book` | `book_1a2b3c4d-5e6f-...` |
| Event | `evt` | `evt_f1e2d3c4-b5a6-...` |

## Referências

- `domain/services/id-generator.ts` - Interface do domain service
- `domain/entities/base/base-entity.ts` - Classe base com configuração
- `infra/services/uuid-id-generator.ts` - Implementação UUID
- `domain/entities/users/user.entity.ts` - Exemplo de uso
