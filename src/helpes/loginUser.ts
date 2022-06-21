import {User} from "../typeorm/entity/User";
import * as bcrypt from "bcryptjs";
import {generateToken} from "./generateToken";
import {getUser} from "./getUser";

export const loginUser = async (
	userMethod,
	password,
	ctx
): Promise<{ token: string }> => {
	let user;
	
	// Check which method user using to log in email/username
	const emailReg =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
	const isEmail = userMethod.match(emailReg);
	
	if (isEmail) {
		// Check if email in database
		user = await User.findOne({
			where: {email: userMethod},
		});
	} else {
		// Check if username in database
		user = await User.findOne({
			where: {username: userMethod},
		});
	}
	
	if (!user) {
		throw new Error("User not found!");
	}
	
	const userPassword = await User.findOne({
		where: {email: user.email},
		select: {password},
	});
	
	const checkPassword = await bcrypt.compare(password, userPassword.password);
	
	if (!checkPassword) {
		throw new Error("Invalid Credential");
	}
	
	const payload = {id: user.id, email: user.email};
	
	const token = await generateToken(payload);
	
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
};
