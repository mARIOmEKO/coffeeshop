import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ConfigModule } from '@nestjs/config'

@Module({
    providers : [{provide: APP_GUARD, useClass: ApiKeyGuard}],
    imports: [ConfigModule],
})
export class CommonModule {}
