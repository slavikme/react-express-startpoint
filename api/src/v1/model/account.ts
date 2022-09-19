import {sha1} from "../tools/hash";
import {query} from "../resource/postgres";
import {queryRolesByUserId, Role} from "./role";

interface AccountRow {
    user_id: number;
    username: string;
    password: string;
    email: string;
    phone: string;
    created_on: string;
    last_login: string | null;
}

export class Account {
    private dbRow: AccountRow;
    private roles: Role[] | undefined;

    constructor(dbRow: AccountRow) {
        this.dbRow = dbRow;
    }

    get userId() {
        return this.dbRow.user_id
    }

    get username() {
        return this.dbRow.username
    }

    get email() {
        return this.dbRow.email
    }

    get creationDate() {
        return new Date(this.dbRow.created_on)
    }

    get lastLoginDate() {
        return this.dbRow.last_login && new Date(this.dbRow.last_login)
    }

    isPasswordMatch = (password: string) => this.dbRow.password === sha1(password)

    getRoles = async (isIgnoreCache = false) => {
        if (this.roles && !isIgnoreCache)
            return this.roles;

        return this.roles = (await queryRolesByUserId(this.userId)).map(role => new Role(role));
    }

    static getByUsernameOrEmail = async (usernameOrEmail: string) => {
        const account = await queryAccountByUsernameOrEmail(usernameOrEmail);
        if (!account)
            throw new Error('ACCOUNT_NOT_FOUND');

        return new Account(account);
    }

    static getByUsernameAndPassword = async (username: string, password: string) => {
        const account = await Account.getByUsernameOrEmail(username);
        if (!account.isPasswordMatch(password))
            throw new Error('WRONG_ACCOUNT_PASSWORD');
        return account;
    }
}

export const queryAccountById = async (userId: number) => {
    const queryResult = await query(`
        SELECT *
        FROM accounts
        WHERE user_id = $1
    `, [userId]);

    return queryResult.rowCount ? queryResult.rows[0] : null;
}

// export const queryAccountByUsernameAndPassword = async (username: string, password: string) => {
//   const queryResult = await query(`
//     SELECT *
//     FROM accounts
//     WHERE (username = $1 OR email = $1) AND password = $2
//   `, [username, sha1(password)]);
//
//   return queryResult.rowCount ? queryResult.rows[0] : null;
// }

export const queryAccountByEmail = async (email: string): Promise<AccountRow | null> => {
    const queryResult = await query(`
        SELECT *
        FROM accounts
        WHERE email = $1
    `, [email]);

    return queryResult.rowCount ? queryResult.rows[0] : null;
}

export const queryAccountByUsername = async (username: string): Promise<AccountRow | null> => {
    const queryResult = await query(`
        SELECT *
        FROM accounts
        WHERE username = $1
    `, [username]);

    return queryResult.rowCount ? queryResult.rows[0] : null;
}

export const queryAccountByUsernameOrEmail = async (usernameOrEmail: string): Promise<AccountRow | null> => {
    const queryResult = await query(`
        SELECT *
        FROM accounts
        WHERE username = $1
           OR email = $1
    `, [usernameOrEmail]);

    return queryResult.rowCount ? queryResult.rows[0] : null;
}

export const queryAccountsByRoleId = async (roleId: number): Promise<AccountRow[]> => {
    const queryResult = await query(`
        SELECT a.*
        FROM accounts a
                 INNER JOIN account_roles ar ON (a.user_id = ar.user_id)
        WHERE ar.role_id = $1
    `, [roleId]);

    return queryResult.rows;
}

export const queryAccountsByRoleName = async (roleName: string): Promise<AccountRow[]> => {
    const queryResult = await query(`
        SELECT a.*
        FROM accounts a
                 INNER JOIN account_roles ar ON (a.user_id = ar.user_id)
        WHERE ar.role_name = $1
    `, [roleName]);

    return queryResult.rows;
}
