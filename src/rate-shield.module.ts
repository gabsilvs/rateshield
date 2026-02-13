import { DynamicModule, Module } from '@nestjs/common';
import { RateShieldService } from './core/rate-shield.service';
import { RateShieldOptions } from './interfaces/rate-shield-options.interface';

@Module({})
export class RateShieldModule {
  static forRoot(options: RateShieldOptions): DynamicModule {
    return {
      module: RateShieldModule,
      providers: [
        RateShieldService,
        {
          provide: 'RATE_SHIELD_OPTIONS',
          useValue: options,
        },
      ],
      exports: [RateShieldService],
    };
  }
}
