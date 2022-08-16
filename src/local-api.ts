import Message from './message.js';
import { request } from './tools.js';
import type { BoardCharArray, RequestOptions } from './types.js';

export default class LocalAPI {
    private readonly key: string;
    private readonly host: string;
    private readonly options: RequestOptions;

    constructor (key: string, host?: string, options?: RequestOptions) {
        this.key = key;
        this.host = host || 'vestaboard.local';
        this.options = options || {};
    }

    private async request<T> (path: string, data?: string, options: RequestOptions = {}): Promise<T> {
        return request(`http://${this.host}:7000/local-api/message`, {
            'X-Vestaboard-Local-Api-Key': this.key
        }, data, Object.assign({}, this.options, options));
    }

    async getCurrentMessage (): Promise<Message> {
        const response = await this.request<{message: BoardCharArray} | BoardCharArray>('/');
        return new Message(Array.isArray(response) ? response : response.message);
    }

    async postMessage (message: Message | string) {
        const msgObj = typeof message === 'string' ? new Message(message) : message;
        await this.request<void>('/',
            JSON.stringify(msgObj.toCharArray()),
            { parseResponse: false }
        );
    }
}
