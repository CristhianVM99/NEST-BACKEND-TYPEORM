import { BaseEntity } from '../../config/base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { EGender, IUser } from '../interfaces/user.inteface';
import { BoardEntity } from 'src/boards/entities/board.entity';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity implements IUser {
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ unique: true })
  username: string;
  @Column()
  age: number;
  @Column()
  password: string;
  @Column({ type: 'enum', enum: EGender })
  gender: EGender;

  @ManyToMany(() => BoardEntity, (board) => board.users)
  @JoinTable()
  boards: BoardEntity[];
}
