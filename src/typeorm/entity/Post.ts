import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: null })
  imageCover: string;

  @Column({ type: "timestamptz", default: new Date() })
  createdAt: Date;

  @Column({ type: "timestamptz", default: null })
  updatedAt: Date;

  @Column({ type: "timestamptz", default: null })
  lastSeen: Date;

  @Column({ default: 0 })
  likes: number;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment;
}
