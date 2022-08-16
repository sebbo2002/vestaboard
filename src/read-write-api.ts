import Message from './message';
import { request } from './tools';
import type { ReadWriteGetMessageResponse, RequestOptions } from './types';

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
