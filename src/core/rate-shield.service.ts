import { Inject, Injectable } from '@nestjs/common';
import {
  RateShieldOptions,
  RateShieldRules,
} from '../interfaces/rate-shield-options.interface';
import { MemoryStore } from '../storage/memory.store';
import { RateLimitEntry } from '../storage/store.interface';

@Injectable()
export class RateShieldService {
  private readonly store: MemoryStore;

  constructor(
    @Inject('RATE_SHIELD_OPTIONS')
    private readonly options: RateShieldOptions,
  ) {
    this.store = new MemoryStore();
  }

  check(ruleKey: string, identifier: string): boolean {
    const rule: RateShieldRules | undefined =
      this.options.rules[ruleKey];

    // Se não existir regra, libera
    if (!rule) {
      return true;
    }

    const now = Date.now();
    const storeKey = `${ruleKey}:${identifier}`;

    let entry: RateLimitEntry | undefined =
      this.store.get(storeKey);

    // Primeira requisição
    if (!entry) {
      this.store.set(storeKey, {
        count: 1,
        firstRequestAt: now,
      });
      return true;
    }

    // Está bloqueado?
    if (entry.blockedUntil && entry.blockedUntil > now) {
      return false;
    }

    // Janela expirou → reseta
    const windowExpired =
      now - entry.firstRequestAt >
      rule.windowMs * 1000;

    if (windowExpired) {
      this.store.set(storeKey, {
        count: 1,
        firstRequestAt: now,
      });
      return true;
    }

    // Incrementa contador
    entry.count += 1;

    // Estourou limite?
    if (entry.count > rule.maxRequests) {
      entry.blockedUntil =
        now + rule.blockDurationMs * 1000;

      this.store.set(storeKey, entry);
      return false;
    }

    this.store.set(storeKey, entry);
    return true;
  }
}
