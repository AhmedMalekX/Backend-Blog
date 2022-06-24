import {sign, verify} from "jsonwebtoken";
import {JwtPayload} from "../../type";

export const generateToken = async (payload, expiresTime = '7d') =>
	await sign(payload, process.env.JSON_WEB_TOKEN_SECRET, {
		expiresIn: expiresTime,
	});


export const verifyToken = async (token) =>
	(await verify(token, process.env.JSON_WEB_TOKEN_SECRET)) as JwtPayload;
