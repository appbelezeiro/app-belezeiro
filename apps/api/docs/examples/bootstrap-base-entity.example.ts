/**
 * Exemplo de como configurar BaseEntity na inicialização da aplicação
 *
 * Este arquivo demonstra como configurar o BaseEntity antes de criar
 * qualquer entidade no sistema.
 */

import { BaseEntity } from '../../src/domain/entities/base';
import { UuidIdGenerator } from '../../src/infra/services';

/**
 * IMPORTANTE: Esta configuração deve ser chamada UMA VEZ
 * na inicialização da aplicação, antes de criar qualquer entidade.
 *
 * Normalmente seria feito no main.ts ou em um arquivo de bootstrap.
 */
export function configureBaseEntity(): void {
  BaseEntity.configure({
    idGenerator: new UuidIdGenerator(),
  });

  console.log('✅ BaseEntity configurado com sucesso!');
}

/**
 * Exemplo de uso após configuração:
 */
export function exampleUsage(): void {
  // 1. Primeiro configurar
  configureBaseEntity();

  // 2. Agora pode criar entidades normalmente
  // import { User } from '../../src/domain/entities/users';
  //
  // const user = User.create({
  //   name: 'João Silva',
  //   email: 'joao@example.com'
  // });
  //
  // console.log(user.id); // Exemplo: user_550e8400-e29b-41d4-a716-446655440000
  //
  // const events = user.pullEvents();
  // console.log(events[0].eventId); // Exemplo: evt_550e8400-e29b-41d4-a716-446655440000
}

/**
 * Exemplo de configuração no futuro com outras opções:
 */
export function futureConfigExample(): void {
  // No futuro você pode adicionar mais configurações ao objeto:
  BaseEntity.configure({
    idGenerator: new UuidIdGenerator(),
    // Exemplo de futuras configurações:
    // timezone: 'America/Sao_Paulo',
    // enableAudit: true,
    // logger: customLogger,
  });
}
