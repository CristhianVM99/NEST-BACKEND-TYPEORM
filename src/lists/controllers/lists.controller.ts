import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ListsService } from '../services/lists.service';
import { CreateListDto } from '../dto/create-list.dto';
import { UpdateListDto } from '../dto/update-list.dto';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get('all')
  public async findAllUsers() {
    return this.listsService.findLists();
  }

  @Get(':id')
  public async findAllUserById(@Param('id') id: string) {
    return this.listsService.findListById(id);
  }

  @Post('register')
  public async registerUser(@Body() createUserDto: CreateListDto) {
    return await this.listsService.createList(createUserDto);
  }

  @Put('edit/:id')
  public async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateListDto,
  ) {
    return await this.listsService.updateList(id, body);
  }

  @Delete('delete/:id')
  public async deleteUser(@Param('id') id: string) {
    return await this.listsService.deleteList(id);
  }
}
