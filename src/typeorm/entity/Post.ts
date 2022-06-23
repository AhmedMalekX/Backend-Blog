import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({default: null})
  imageCover: string;

  @Column({ type: "timestamptz", default: new Date() })
  createdAt: Date;

  @Column({ type: "timestamptz", default: null })
  updatedAt: Date;

  @Column({ type: "timestamptz", default: null })
  lastSeen: Date;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}
