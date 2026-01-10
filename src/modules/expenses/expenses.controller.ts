import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseEntity } from './entities/expense.entity';

@ApiTags('Expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense', description: 'Request Body: CreateExpenseDto, Response: ExpenseEntity' })
  @ApiResponse({ status: 201, description: 'The expense has been successfully created. (ExpenseEntity)', type: ExpenseEntity })
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses', description: 'Response: ExpenseEntity[]' })
  @ApiResponse({ status: 200, description: 'Return all expenses. (ExpenseEntity[])', type: ExpenseEntity, isArray: true })
  findAll() {
    return this.expensesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense by ID', description: 'Params: id (number), Response: ExpenseEntity' })
  @ApiResponse({ status: 200, description: 'Return the expense. (ExpenseEntity)', type: ExpenseEntity })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense', description: 'Params: id (number), Request Body: UpdateExpenseDto, Response: ExpenseEntity' })
  @ApiResponse({ status: 200, description: 'The expense has been successfully updated. (ExpenseEntity)', type: ExpenseEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense', description: 'Params: id (number), Response: ExpenseEntity' })
  @ApiResponse({ status: 200, description: 'The expense has been successfully deleted. (ExpenseEntity)', type: ExpenseEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.remove(id);
  }
}
