import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/provider/prisma.provider';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const { expenseTime, category, ...rest } = createExpenseDto;
    return this.prisma.expense.create({
      data: {
        ...rest,
        category: BigInt(category),
        expenseTime: expenseTime ? new Date(expenseTime) : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.expense.findMany();
  }

  async findOne(id: number) {
    return this.prisma.expense.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const { expenseTime, category, ...rest } = updateExpenseDto;
    const data: any = { ...rest };

    if (category !== undefined) {
      data.category = BigInt(category);
    }
    if (expenseTime) {
      data.expenseTime = new Date(expenseTime);
    }

    return this.prisma.expense.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.expense.delete({
      where: { id },
    });
  }
}
