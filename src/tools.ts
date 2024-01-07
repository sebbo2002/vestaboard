import { RequestFetchOptions, RequestFetchResponse, RequestOptions } from './types.js';

export async function request<T> (
    url: string,
    headers: Record<string, string>,
    data?: Record<string, unknown> | string,
    options: RequestOptions = {}
): Promise<T> {
    const method = data === undefined ? 'GET' : 'POST';
    if (data !== undefined) {
        Object.assign(headers, {
            'Content-Type': 'application/json'
        });
    }

    const init: RequestFetchOptions = {
        method,
        headers
    };
    if(data !== undefined && typeof data === 'string') {
        init.body = data;
    }
    else if(data !== undefined) {
        init.body = JSON.stringify(data);
    }

    let response: RequestFetchResponse | null = null;
    for (let i = 0; i < 10; i++) {
        response = await (options.fetch || fetch)(url, init);
        if(response.ok) {
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if(!response.ok) {
        throw new Error('HTTP Request failed');
    }

    if(options.parseResponse === false) {
        return undefined as unknown as T;
    }

    const json = await response.json();
    return json as T;
}
