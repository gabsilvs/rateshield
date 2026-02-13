const fs = require('fs').promises;
const path = require('path');

async function ensureFile(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.writeFile(filePath, content, { flag: 'wx' });
    console.log('Created', filePath);
  } catch (err) {
    if (err.code === 'EEXIST') console.log('Skipped (exists)', filePath);
    else throw err;
  }
}

async function run() {
  const repoRoot = path.join(__dirname, '..');
  const toCreate = {
    'src/index.ts': `export * from './rate-shield.module';\n`,
    'src/rate-shield.module.ts': `import { Module } from '@nestjs/common';\n\n@Module({})\nexport class RateShieldModule {}\n`,
    'src/rate-shield.guard.ts': `import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class RateShieldGuard implements CanActivate {\n  canActivate(context: ExecutionContext) {\n    return true;\n  }\n}\n`,
    'src/decorators/rate-limit.decorator.ts': `import { SetMetadata } from '@nestjs/common';\n\nexport const RATE_LIMIT = 'rate_limit';\nexport const RateLimit = (points: number) => SetMetadata(RATE_LIMIT, points);\n`,
    'src/interfaces/rate-shield-options.interface.ts': `export interface RateShieldOptions {\n  points?: number;\n  windowMs?: number;\n}\n`,
    'src/storage/store.interface.ts': `export interface Store {\n  increment(key: string): Promise<number>;\n  reset(key: string): Promise<void>;\n}\n`,
    'src/storage/memory.store.ts': `import { Store } from './store.interface';\n\nexport class MemoryStore implements Store {\n  private map = new Map<string, number>();\n  async increment(key: string) {\n    const v = (this.map.get(key) || 0) + 1;\n    this.map.set(key, v);\n    return v;\n  }\n  async reset(key: string) {\n    this.map.delete(key);\n  }\n}\n`,
    'src/core/rate-shield.service.ts': `export class RateShieldService {\n}\n`,
  };

  for (const [rel, content] of Object.entries(toCreate)) {
    const filePath = path.join(repoRoot, rel);
    await ensureFile(filePath, content);
  }

  console.log('Generation complete.');
}

run().catch(err => { console.error(err); process.exit(1); });
