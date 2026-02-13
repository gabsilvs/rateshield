export interface RateShieldRules{
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
}

export interface RateShieldOptions {
  storage: 'memory';
  rules: Record<string, RateShieldRules>;
}