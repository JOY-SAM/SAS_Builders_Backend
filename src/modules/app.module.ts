import { Module } from '@nestjs/common';

import { CommonModule } from './common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ExpensesModule } from './expenses/expenses.module';
import { DriversModule } from './drivers/drivers.module';

@Module({
    imports: [
        CommonModule,
        UsersModule,
        AuthModule,
        VehiclesModule,
        ExpensesModule,
        DriversModule,
    ]
})
export class ApplicationModule {}
