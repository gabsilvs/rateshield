import { SetMetadata } from '@nestjs/common';

/**
 * Chave usada para armazenar o metadata do rate limit
 * Essa constante será lida pelo Guard
 */
export const RATE_LIMIT_KEY = 'RATE_LIMIT_KEY';

/**
 * Decorator que define qual regra de rate limit
 * será aplicada a uma rota específica
 *
 * Exemplo de uso:
 * @RateLimit('LOGIN')
 */
export const RateLimit = (key: string) =>
  SetMetadata(RATE_LIMIT_KEY, key);
