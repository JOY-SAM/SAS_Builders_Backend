import { Module } from '@nestjs/common';

import { CommonModule } from './common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        CommonModule,
        UsersModule,
        AuthModule,
    ]
})
export class ApplicationModule {}
