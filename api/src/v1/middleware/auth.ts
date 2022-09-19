import {jwtVerify, SignJWT} from 'jose';
import {Request, RequestHandler} from 'express';
import {parseDate} from "chrono-node";
import {setTokenCookie} from "../tools/cookie";

const {
    JWT_EXPIRES_IN = "",
    JWT_SECRET = ""
} = process.env;

const jwtSecret = new TextEncoder().encode(JWT_SECRET);

export class AuthRequestExtractor {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    get fromBody(): string | undefined {
        return this.req.body.token?.toString()
    }

    get fromQuery(): string | undefined {
        return this.req.query.token?.toString();
    }

    get fromXATHeader(): string | undefined {
        return this.req.headers["x-access-token"]?.toString()
    }

    get fromCookies(): string | undefined {
        return this.req.cookies.token?.toString()
    }

    get fromAuthHeader(): string | undefined {
        const authData = (this.req.headers["authorization"]?.toString() || "").trim();
        if (!authData)
            return;

        if (authData.indexOf(" ") === -1)
            return authData;

        const [authType, authToken] = authData.split(/\s+/g);

        if (["jwt", "token", "bearer"].includes(authType.toLowerCase()) && authToken)
            return authToken;
    }

    get hasUser(): boolean {
        return !!this.req.user;
    }

    hasRole(role: string): boolean {
        if (!this.hasUser)
            return false;

        if (role === "")
            return true;

        return !!this.req.user?.roles.includes(role);
    }
}

export const ROLE_ADMIN = "admin";

/**
 * Create authentication middleware to comply with specific authorization defined by role.
 * @param role Optional. The required role. IF not provided, any role is accepted.
 */
export const requireAuth = (role: string = ""): RequestHandler => async (req, res, next) => {
    const re = new AuthRequestExtractor(req);

    if ( re.hasUser ) {
        if ( !re.hasRole(role) )
            return res.status(401).json({error: {code: 'NOT_AUTHORIZED', message: `The provided token is not authorized to access this section`}});

        return next();
    }

    const token = re.fromBody || re.fromQuery || re.fromXATHeader || re.fromAuthHeader || re.fromCookies;

    if (!token)
        return res.status(403).json({error: {code: 'NOT_AUTHENTICATED', message: `This section requires authentication token`}});

    try {
        const {payload:{iss, userId, aud}} = await jwtVerify(token, jwtSecret, {audience: role});
        req.user = {
            userId: userId as number,
            username: iss as string,
            roles: aud as string[],
        };
        await setTokenCookie(res, req.user);
    } catch (err) {
        return res.status(401).json({error: {code: 'NOT_AUTHORIZED', message: `The provided token is invalid or is not authorized to access this section`}});
    }
    return next();
};
