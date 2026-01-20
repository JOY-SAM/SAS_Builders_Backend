import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

import { CommonModule } from './common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ExpensesModule } from './expenses/expenses.module';
import { DriversModule } from './drivers/drivers.module';


import { OilExpenseModule } from './oil-expense/oil-expense.module';
import { PrismaStudioModule } from './prisma-studio/prisma-studio.module';


@Module({
    imports: [
        CommonModule,
        UsersModule,
        AuthModule,
        VehiclesModule,
        ExpensesModule,
        DriversModule,
        OilExpenseModule,
        PrismaStudioModule,    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})

export class ApplicationModule {}
