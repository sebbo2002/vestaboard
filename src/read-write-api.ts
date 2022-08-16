import Message from './message.js';
import { request } from './tools.js';
import type { ReadWriteGetMessageResponse, RequestOptions } from './types.js';

export default class ReadWriteAPI {
    private readonly key: string;
    private readonly options: RequestOptions;

    constructor (key: string, options?: RequestOptions) {
        this.key = key;
        this.options = options || {};
    }

    private async request<T> (path: string, data?: string): Promise<T> {
        return request(`https://rw.vestaboard.com${path}`, {
            'X-Vestaboard-Read-Write-Key': this.key
        }, data, this.options);
    }

    async getCurrentMessage (): Promise<Message> {
        const response = await this.request<ReadWriteGetMessageResponse>('/');
        return new Message(JSON.parse(response.currentMessage.layout));
    }

    async postMessage (message: Message | string) {
        const msgObj = typeof message === 'string' ? new Message(message) : message;
        await this.request<void>('/',
            JSON.stringify(msgObj.toCharArray())
        );
    }
}
