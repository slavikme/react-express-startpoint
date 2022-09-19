import {Account, queryAccountsByRoleId} from "./account";
import {query} from "../resource/postgres";
import {sha1} from "../tools/hash";

interface RoleRow {
  role_id: number;
  role_name: string;
}

export class Role {
  private dbRow: RoleRow;
  private accounts: Account[];

  constructor(dbRow: RoleRow) {
    this.dbRow = dbRow;
  }

  get roleId() { return this.dbRow.role_id }
  get roleName() { return this.dbRow.role_name }

  getAccounts = async (isIgnoreCache = false) => {
    if ( this.accounts && !isIgnoreCache )
      return this.accounts;

    return this.accounts = (await queryAccountsByRoleId(this.roleId)).map(account => new Account(account));
  }
}

export const queryRoleById = async (roleId: number) => {
  const queryResult = await query(`
    SELECT *
    FROM roles
    WHERE role_id = $1
  `, [roleId]);

  return queryResult.rowCount ? queryResult.rows[0] : null;
}

export const queryRoleByName = async (roleName: string) => {
  const queryResult = await query(`
    SELECT *
    FROM roles
    WHERE role_name = $1
  `, [roleName]);

  return queryResult.rowCount ? queryResult.rows[0] : null;
}

export const queryRolesByUserId = async (userId: number) => {
  const queryResult = await query(`
      SELECT r.*
      FROM roles r
      INNER JOIN account_roles ar ON (ar.role_id = r.role_id)
      WHERE ar.user_id = $1
    `, [userId]);

  return queryResult.rows;
}
