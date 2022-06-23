import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from "typeorm";
import {Post} from "./Post";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly id: number;
	
	@Column()
	firstName: string;
	
	@Column()
	lastName: string;
	
	@Column({default: Date.now()})
	username: string;
	
	@Column({unique: true})
	email: string;
	
	@Column({select: false})
	password: string;
	
	@Column({default: "user"})
	role: string;
	
	@Column({default: false})
	profileStatus: boolean;
	
	@Column({enum: ["sliver", "gold", "diamond"], default: "silver"})
	userStatus: string;
	
	@Column({default: 0})
	followers: number;
	
	@Column({default: 0})
	following: number;
	
	@OneToMany(() => Post, (post) => post.author)
	posts: Post[];
}
