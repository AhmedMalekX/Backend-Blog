import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
} from "typeorm";
import {User} from "./User";
import {Post} from "./Post";

@Entity()
export class Comment extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly id: number;
	
	@Column()
	body: string;
	
	@Column({type: "timestamptz", default: new Date()})
	createdAt: Date;
	
	@Column({type: "timestamptz", default: null})
	updatedAt: Date;
	
	@Column({default: 0})
	likes: number;
	
	@ManyToOne(() => User, (user) => user.comments)
	author: User;
	
	@ManyToOne(() => Post, (post) => post.comments)
	post: Post;
}
