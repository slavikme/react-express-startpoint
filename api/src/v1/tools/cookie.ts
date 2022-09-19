import {SignJWT} from "jose";
import {parseDate} from "chrono-node";
import {Response} from "express";
const {
    JWT_EXPIRES_IN = "",
    JWT_SECRET = ""
} = process.env;

interface TokenPayload {
    userId: number;
    username: string;
    roles: string[];
}

export const setTokenCookie = async (res: Response, {userId, username, roles}: TokenPayload) => {
    const token = await new SignJWT({userId})
        .setProtectedHeader({alg: 'HS512'})
        .setIssuedAt()
        .setIssuer(username)
        .setAudience(roles)
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(new TextEncoder().encode(JWT_SECRET));
    res.cookie('token', token, {expires: parseDate(JWT_EXPIRES_IN + ' from now')});
    return token;
}
