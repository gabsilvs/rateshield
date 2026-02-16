# RateShield

RateShield is a simple, extensible, and framework-friendly rate limiting library for NestJS applications.

It allows you to protect sensitive actions (such as login, password reset, user updates, etc.) using decorators, without coupling rate limit logic to controllers or services.

---

## Features

- Built specifically for NestJS
- Decorator-based API
- Dynamic configuration via `forRoot`
- Action-based rate limiting (not route-based)
- In-memory storage by default
- Easy to extend (Redis, database, user-based, etc.)
- Clean and minimal public API

---

## Installation

```bash
npm install @yonki/rateshield
```

## Setup

Import RateShieldModule in your root module:

```typescript
import { Module } from '@nestjs/common';
import { RateShieldModule } from '@yonki/rateshield';

@Module({
  imports: [
    RateShieldModule.forRoot({
      // Set the storage type (currently only 'memory' is supported, Redis will be suported soon).
      storage: 'memory',
      rules: {
        LOGIN: {
          maxRequests: 5,
          windowMs: 60,
          blockDurationMs: 300
        },
        EDIT_USER: {
          maxRequests: 10,
          windowMs: 60,
          blockDurationMs: 60
        }
      }
    })
  ]
})
export class AppModule {}
```

Notes:
- **Storage:** set `storage` to the storage provider you want (for now use `'memory'`).
- **Fields:** `maxRequests` — máximo de requisições por janela; `windowMs` — janela em segundos; `blockDurationMs` — duração do bloqueio em segundos após estourar o limite.

## Usage

Protect any route using the @RateLimit() decorator.

### Example: Login

```typescript
import { Controller, Post } from '@nestjs/common';
import { RateLimit } from '@yonki/rateshield';

@Controller('auth')
export class AuthController {
  @Post('login')
  @RateLimit('LOGIN')
  login() {
    return 'ok';
  }
}
```

### Example: Edit User

```typescript
import { Put } from '@nestjs/common';
import { RateLimit } from '@yonki/rateshield';

@Put(':id')
@RateLimit('EDIT_USER')
updateUser() {
  return 'user updated';
}
```

Each key (LOGIN, EDIT_USER, etc.) maps to a rule defined in forRoot.

## Rate Limit Exceeded Response

When the rate limit is exceeded, the request is blocked with the following response:

```json
{
  "statusCode": 429,
  "message": "Too many requests, try again later"
}
```

## Design Philosophy

- Rate limits are defined by action, not by route
- Controllers remain clean and focused on business logic
- Configuration is centralized in one place
- The library is easy to extend without breaking the public API

## Roadmap

- Redis storage adapter
- Rate limiting by userId (JWT-based)
- Global default rate limit rule
- Role-based limits
- Cluster-safe support

## Contributing

Contributions are welcome.

If you want to add new storage providers, improve performance, or suggest new features, feel free to open an issue or pull request.

## License

MIT
