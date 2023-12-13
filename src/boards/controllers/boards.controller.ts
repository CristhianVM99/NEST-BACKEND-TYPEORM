import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { BoardsService } from '../services/boards.service';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get('all')
  public async findAllBoards() {
    return this.boardsService.findBoards();
  }

  @Get(':id')
  public async findAllBoardById(@Param('id') id: string) {
    return this.boardsService.findBoardById(id);
  }

  @Post('register')
  public async registerBoard(@Body() createBoardDto: CreateBoardDto) {
    return await this.boardsService.createBoard(createBoardDto);
  }

  @Put('edit/:id')
  public async updateBoard(
    @Param('id') id: string,
    @Body() body: UpdateBoardDto,
  ) {
    return await this.boardsService.updateBoard(id, body);
  }

  @Delete('delete/:id')
  public async deleteBoard(@Param('id') id: string) {
    return await this.boardsService.deleteBoard(id);
  }
}
