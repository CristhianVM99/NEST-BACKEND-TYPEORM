import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from '../entities/board.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {}  

  public async findBoards(): Promise<BoardEntity[]> {
    try {
      const boards: BoardEntity[] = await this.boardRepository.find({
        relations: ['lists'],
      });
      if (boards.length === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No hay registros',
        });
      }
      return boards;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findBoardById(id: string): Promise<BoardEntity> {
    try {
      const board: BoardEntity = await this.boardRepository
        .createQueryBuilder('boards')
        .where({ id })
        .getOne();
      if (!board) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontró el registro.',
        });
      }
      return board;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async createBoard(
    createUserDto: CreateBoardDto,
  ): Promise<BoardEntity> {
    try {
      return await this.boardRepository.save(createUserDto);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateBoard(
    id: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<UpdateResult | undefined> {
    try {
      const board: UpdateResult = await this.boardRepository.update(
        id,
        updateBoardDto,
      );
      if (board.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se puedo actualizar',
        });
      }
      return board;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteBoard(id: string): Promise<DeleteResult | undefined> {
    try {
      const board: DeleteResult = await this.boardRepository.delete(id);
      if (board.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se pudo eliminar',
        });
      }
      return board;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // public async addListsToBoard(id: string, listIds: string[]): Promise<void> {
  //   try {
  //     const board = await this.boardRepository.findOne({
  //       where: { id },
  //       relations: ['lists'],
  //     });
  //     const uniqueListIds = listIds.filter((id)=> !)
  //   } catch (error) {}
  // }
}
