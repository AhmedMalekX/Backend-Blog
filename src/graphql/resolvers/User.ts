import * as bcrypt from "bcryptjs";
import {User} from "../../typeorm/entity/User";
import {LoginInput, RegisterInput} from "../../../type";
import {loginUser} from "../../helpes/loginUser";
import {generateToken, verifyToken} from "../../helpes/generateToken";
import {sendMail} from "../../helpes/sendMail";
import {AppDataSource} from "../../typeorm/data-source";

export default {
	Query: {
		getAllUsers: async () => {
			return await User.find({});
		},
		
		getUser: async (_, {id}: { id: any }) => {
			return await User.findOne({
				where: {
					id,
				},
			});
		},
		
		getCurrentUser: async (_, __, {user}) => user,
	},
	
	Mutation: {
		register: async (
			_,
			{data: {firstName, lastName, email, password}}: RegisterInput,
			ctx
		) => {
			// Check for coming data
			if (!firstName || !lastName || !email || !password) {
				throw new Error("Invalid Credential");
			}
			
			// Check if email already exists
			const emailExists = await User.findOne({
				where: {
					email,
				},
			});
			
			if (emailExists) {
				throw new Error("Email Already Taken");
			}
			
			// Hash Password
			const salt = await bcrypt.genSalt(12);
			const encryptedPassword = await bcrypt.hash(password, salt);
			
			// Register User
			const user = await User.save({
				firstName,
				lastName,
				email,
				password: encryptedPassword,
			});
			
			const token = await generateToken({id: user.id, email: user.email});
			
			ctx.req.cookies.token = token;
			ctx.res.cookie("token", token, {
				httpOnly: true,
				// secure: process.env.NODE_ENV === 'production',
				// important to set cookies
				secure: true,
				sameSite: "none",
				maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
			});
			
			return {token};
		},
		login: async (_, {data: {userMethod, password}}: LoginInput, ctx) => {
			// Check for coming data
			if (!userMethod || !password) {
				throw new Error("Invalid Credential");
			}
			
			return await loginUser(userMethod, password, ctx);
		},
		forgetPassword: async (_, {email}) => {
			// check if user exists in database
			const user = await User.findOne({where: {email}});
			
			if (!user) {
				return;
			}
			
			console.log({user});
			
			const token = await generateToken(
				{id: user.id, email: user.email},
				"15m"
			);
			
			const receiverEmail = user.email;
			
			await sendMail(receiverEmail, "Reset Password", token);
			
			return true;
		},
		resetPassword: async (_, {token, newPassword}) => {
			if (!token || !newPassword) {
				throw new Error("Invalid Data");
			}
			
			const {id} = await verifyToken(token);
			
			const user = await AppDataSource.getRepository(User)
				.createQueryBuilder("user")
				.where("user.id = :id", {id})
				.addSelect("user.password")
				.getOne();
			
			user.password = await bcrypt.hash(newPassword, 12);
			
			await User.save(user);
			
			return true;
		},
		updatePassword: async (_, {oldPassword, newPassword}, {user}) => {
			if (!user) {
				throw new Error("You must login to update your password");
			}
			
			if (!oldPassword || !newPassword) {
				throw new Error("Invalid Data");
			}
			
			const fullUserData = await AppDataSource.getRepository(User)
				.createQueryBuilder("user")
				.where("user.id = :id", {id: user.id})
				.addSelect("user.password")
				.getOne();
			
			const matchedPassword = await bcrypt.compare(
				oldPassword,
				fullUserData.password
			);
			
			if (!matchedPassword) {
				throw new Error("Wrong Password !!");
			}
			
			// console.log({user})
			
			fullUserData.password = await bcrypt.hash(newPassword, 12);
			
			await User.save(fullUserData);
			
			return true;
		},
	},
};
