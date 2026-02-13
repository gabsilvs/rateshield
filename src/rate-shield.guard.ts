import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY } from './decorators/rate-limit.decorator';
import { RateShieldService } from './core/rate-shield.service';

@Injectable()
export class RateShieldGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rateShieldService: RateShieldService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rateLimitKey = this.reflector.get<string>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    if (!rateLimitKey) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const identifier = request.ip;

    const allowed = this.rateShieldService.check(
      rateLimitKey,
      identifier,
    );

    if (!allowed) {
      throw new HttpException(
        'Too many requests, try again later',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
