import storage, {StorageType} from "../tool/storage";
import {IUser} from "./User";
import {Cookies} from "react-cookie";

interface ITokenPayload {
    userId: number;
    iat: number;
    iss: string;
    aud: string[];
    exp: number;
}

export interface ISession {
    user: IUser;
    roles: string[];
    token: string;
}

const parseToken = (token: string): ITokenPayload => {
    try {
        return JSON.parse(atob(token.split(".")[1] || "")) as ITokenPayload;
    } catch (e) {
        throw new Error("Unable to parse token's payload data");
    }
};

const guestUser: IUser = {
    id: -1,
    username: 'guest',
    email: '',
    creationTime: new Date(),
};

const EXPIRED_DATE = new Date(0);

export class Session {
    private expirationTime: Date;
    private tokenPayload: ITokenPayload;

    /**
     * @param user The user object.
     * @param roles The permission roles the user can access.
     * @param token JWT token.
     * @param storageType The type of the storage to save the session in.
     */
    constructor(
        public readonly user: IUser = guestUser,
        public readonly roles: string[] = ['guest'],
        public readonly token: string = '',
        private readonly storageType: StorageType = StorageType.LocalStorage,
    ) {
        if (!user || !roles || !roles.length)
            throw new Error('Invalid data provided to Session class');

        if (token) {
            try {
                this.tokenPayload = parseToken(token);
            } catch (e) {
                throw new Error("Unable to parse token's data");
            }
            storageType && storage(storageType, 'session', {user, roles, token});
            this.roles = ['guest', 'user', ...roles];
        } else {
            const iat = guestUser.creationTime.getTime() / 1000;
            this.tokenPayload = {
                aud: ['guest'],
                exp: iat + 1e9,
                iss: 'client',
                iat,
                userId: guestUser.id,
            }
        }

        this.expirationTime = new Date(this.tokenPayload.exp * 1000);
    }

    get isGuest() {
        return this.user === guestUser;
    }

    /**
     * Create a session instance from storage data.
     *
     * @param storageType The type of the storage to use.
     */
    static fromStorage = (storageType: StorageType = StorageType.LocalStorage) => {
        const storageSession = storage.get<ISession | undefined>(storageType, 'session');
        if (!storageSession)
            return void 0;

        const {user, roles, token} = storageSession;

        const session = new Session(user, roles, token, storageType);

        if (session.isExpired) {
            session.logout()
            return void 0;
        }

        return session;
    };

    /**
     * Check whether the session is expired.
     */
    get isExpired() {
        return new Date() > this.expirationTime;
    }

    /**
     * Check whether the provided role exists in user's roles.
     *
     * @param role A single role or a list of rows (array).
     */
    hasRole = (role: string | string[]) =>
        (Array.isArray(role) ? role : [role]).some(r => this.roles.includes(r));

    /**
     * Log the session out, by clearing the session that saved in the storage
     * and resetting the token expiration time.
     */
    logout = () => {
        new Cookies().remove('token');
        this.storageType && storage.clear(this.storageType, 'session');
        this.expirationTime = EXPIRED_DATE;
    }
}
