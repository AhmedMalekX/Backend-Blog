import {verifyToken} from "./generateToken";
import {User} from "../typeorm/entity/User";

export const getUser = async (token) => {
	if (!token) return;
	const {email} = await verifyToken(token);
	
	return await User.findOne({
		where: {
			email,
		},
	});
};
