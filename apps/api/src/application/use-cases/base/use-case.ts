/**
 * Interface base para Use Cases
 *
 * Um Use Case representa uma ação específica do sistema,
 * orquestrando entidades, repositórios e serviços para
 * realizar uma operação de negócio.
 */
export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

/**
 * Use Case que não retorna nada
 */
export interface CommandUseCase<TInput> {
  execute(input: TInput): Promise<void>;
}

/**
 * Use Case que não recebe input
 */
export interface QueryUseCase<TOutput> {
  execute(): Promise<TOutput>;
}
