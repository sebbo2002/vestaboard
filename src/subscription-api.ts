import Message from './message.js';
import { request } from './tools.js';
import type { SubscriptionPostResponse, Subscriptions, Viewer } from './types.js';
import type { RequestOptions } from './types.js';

export default class SubscriptionAPI {
    private readonly key: string;
    private readonly secret: string;
    private readonly options: RequestOptions;

    constructor (key: string, secret: string, options?: RequestOptions) {
        this.key = key;
        this.secret = secret;
        this.options = options || {};
    }

    private async request<T> (path: string, data?: Record<string, unknown>): Promise<T> {
        return request(`https://platform.vestaboard.com${path}`, {
            'X-Vestaboard-Api-Key': this.key,
            'X-Vestaboard-Api-Secret': this.secret
        }, data, this.options);
    }

    async getViewer (): Promise<Viewer> {
        return await this.request<Viewer>('/viewer');
    }

    async getSubscriptions (): Promise<Subscriptions> {
        return await this.request<Subscriptions>('/subscriptions');
    }

    async postMessage (message: Message | string): Promise<SubscriptionPostResponse[]>;
    async postMessage (message: Message | string, subscriptionId: string): Promise<SubscriptionPostResponse>;
    async postMessage (message: Message | string, subscriptionIds: string[]): Promise<SubscriptionPostResponse[]>;
    async postMessage (message: Message | string, subscriptionIds?: string | string[]) {
        let singleMode = false;
        const ids: string[] = [];
        const msgObj = typeof message === 'string' ? new Message(message) : message;

        if (typeof subscriptionIds === 'string') {
            singleMode = true;
            ids.push(subscriptionIds);
        } else if (Array.isArray(subscriptionIds)) {
            ids.push(...subscriptionIds);
        } else {
            const subscriptions = await this.getSubscriptions();
            ids.push(...subscriptions.subscriptions.map(subscription => subscription._id));
        }

        const results: SubscriptionPostResponse[] = [];
        for (const id of ids) {
            results.push(
                await this.request<SubscriptionPostResponse>(`/subscriptions/${id}/message`, {
                    characters: msgObj.toCharArray()
                })
            );
        }
        if (singleMode) {
            return results[0];
        }

        return results;
    }
}