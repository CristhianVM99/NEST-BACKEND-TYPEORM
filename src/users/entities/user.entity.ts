import { BaseEntity } from '../../config/base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { EGender, IUser } from '../interfaces/user.inteface';
import { BoardEntity } from 'src/boards/entities/board.entity';

/*
 * entity user.
 */
@Entity({ name: 'users' })
export class UserEntity extends BaseEntity implements IUser {
  @Column({ type: 'varchar', length: '255' })
  name: string;
  @Column({ type: 'varchar', unique: true })
  email: string;
  @Column({ type: 'varchar', unique: true })
  username: string;
  @Column({ type: 'integer' })
  age: number;
  @Column({ type: 'varchar' })
  password: string;
  @Column({ type: 'enum', enum: EGender, default: EGender.MALE })
  gender: EGender;

  @ManyToMany(() => BoardEntity, (board) => board.users, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  boards: BoardEntity[];
}
