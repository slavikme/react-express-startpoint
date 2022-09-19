import {useSession} from "../SessionContext";

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

class ResponseError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
    }
}

const BASE_URL = '/api/v1';

export class ApiRequest {
    constructor(
        private token: string = '',
        private baseUrl: string = BASE_URL,
    ) {
    }

    private request = async (method: RequestMethod, path: string, data?: any) => {
        const result = await fetch(this.baseUrl + path, {
            method,
            headers: {
                'Content-Type': 'application/json',
                // ...(this.token && {'Authorization': `jwt ${this.token}`}),
            },
            body: data && JSON.stringify(data)
        });

        if (!result.ok)
            throw new Error(`An error returned from the server (${result.status} ${result.statusText}). Please, try again later.`)

        const response = await result.json();
        if (response.error)
            throw new ResponseError(response.error.message, response.error.code);

        return response;
    }

    get = (path: string) => this.request('get', path);
    post = (path: string, data?: any) => this.request('post', path, data);
    put = (path: string, data?: any) => this.request('put', path, data);
    delete = (path: string) => this.request('delete', path);
}

export const useApi = (baseUrl: string = BASE_URL) => {
    const {session: {token}} = useSession();
    return new ApiRequest(token, baseUrl);
}
