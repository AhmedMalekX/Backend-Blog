import {User} from "../typeorm/entity/User";
import * as bcrypt from 'bcryptjs'

export const loginUser = async (userMethod, password) => {
	let user;
	
	// Check which method user using to log in email/username
	const emailReg =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
	const isEmail = userMethod.match(emailReg);
	
	console.log({isEmail});
	
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
	
	const checkPassword = await bcrypt.compare(password, user.password);
	
	if (!checkPassword) {
		throw new Error("Invalid Credential");
	}
	
	return {user};
};
