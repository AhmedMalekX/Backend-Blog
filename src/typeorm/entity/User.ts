import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;
	
	@Column()
	firstName: string;
	
	@Column()
	lastName: string;
	
	@Column({default: Date.now()})
	username: string;
	
	@Column({unique: true})
	email: string;
	
	@Column()
	password: string;
	
	@Column({default: "user"})
	role: string;
	
	@Column({default: false})
	profileStatus: boolean;
	
	@Column({enum: ["sliver", "gold", "diamond"], default: "silver"})
	userStatus: string;
}
