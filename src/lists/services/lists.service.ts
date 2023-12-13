import { Injectable } from '@nestjs/common';
import { CreateListDto } from '../dto/create-list.dto';
import { UpdateListDto } from '../dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ListEntity } from '../entities/list.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,
  ) {}

  public async findLists(): Promise<ListEntity[]> {
    try {
      const lists: ListEntity[] = await this.listRepository.find();
      if (lists.length === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No hay Registros',
        });
      }
      return lists;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findListById(id: string): Promise<ListEntity> {
    try {
      const list = await this.listRepository
        .createQueryBuilder('lists')
        .where({ id })
        .getOne();
      if (!list) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro el registro.',
        });
      }
      return list;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async createList(createListDto: CreateListDto): Promise<ListEntity> {
    try {
      return await this.listRepository.save(createListDto);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateList(
    id: string,
    updateListDto: UpdateListDto,
  ): Promise<UpdateResult | undefined> {
    try {
      const list: UpdateResult = await this.listRepository.update(
        id,
        updateListDto,
      );

      if (list.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se se pudo actualizar',
        });
      }
      return list;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteList(id: string): Promise<DeleteResult | undefined> {
    try {
      const list: DeleteResult = await this.listRepository.delete(id);
      if (list.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se se pudo eliminar',
        });
      }
      return list;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
