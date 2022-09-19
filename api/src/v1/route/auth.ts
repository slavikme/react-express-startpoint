import {Router} from 'express';
import {Account} from "../model/account";
import {setTokenCookie} from "../tools/cookie";

const router = Router();

router.post('/', async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password)
        return res.json({error: {code: 'CREDENTIALS_MISSING', message: `Missing username or password`}});

    if (typeof username !== 'string' || typeof password !== 'string')
        return res.json({error: {code: 'CREDENTIALS_INVALID', message: `Username and password must be string`}});

    let account;
    try {
        account = await Account.getByUsernameAndPassword(username, password);
    } catch (e) {
        return res.json({error: {code: 'CREDENTIALS_NOT_MATCH', message: `Username and password doesn't match`}});
    }

    const accountRoles = await account.getRoles(true);

    const {userId, email, creationDate, lastLoginDate} = account;
    const roles = accountRoles.map(role => role.roleName);

    const payload = {
        user: {
            id: userId,
            name: username,
            email,
            lastLoginTime: lastLoginDate,
            creationTime: creationDate,
        },
        roles,
    };

    const token = await setTokenCookie(res, {userId, username, roles});
    res.json({payload, token})
});

export default router;
