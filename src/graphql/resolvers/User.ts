import * as bcrypt from "bcryptjs";
import {User} from "../../typeorm/entity/User";
import {LoginInput, RegisterInput} from "../../../type";
import {loginUser} from "../../helpes/loginUser";
import {generateToken} from "../../helpes/generateToken";

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
	},
};
