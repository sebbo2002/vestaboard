import LocalAPI from './local-api.js';
import ReadWriteAPI from './read-write-api.js';
import SubscriptionAPI from './subscription-api.js';

export const BOARD_LINE_LENGTH = 22;
export const BOARD_LINES = 6;

export enum MessageWritePosition {
    CURRENT,
    NO_SPACE_BETWEEN,
    NEXT_LINE,
}

export type BoardCharArray = [
    BoardCharLine,
    BoardCharLine,
    BoardCharLine,
    BoardCharLine,
    BoardCharLine,
    BoardCharLine,
];

export type BoardCharLine = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
];

export type Boards = Array<LocalAPI | ReadWriteAPI | SubscriptionAPI>;

export interface Installation {
    _id: string;
    installable?: {
        _id: string;
    };
}

export interface MessageWriteCoords {
    line: number;
    row?: number;
    width?: number;
}

export interface MessageWriteOptions {
    fallbackChar?: null | number;
    indent?: boolean | number;
    position?: MessageWriteCoords | MessageWritePosition;
    removeUnsupportedWords?: boolean;
}

export interface ReadWriteGetMessageResponse {
    currentMessage: {
        layout: string;
    };
}

export interface RequestFetchOptions {
    body?: string;
    headers?: Record<string, string>;
    method?: string;
}

export interface RequestFetchResponse {
    json(): Promise<unknown>;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
}

export interface RequestOptions {
    fetch?: RequestOptionsFetch;
    parseResponse?: boolean;
}

export type RequestOptionsFetch = (
    url: string,
    init?: RequestFetchOptions,
) => Promise<RequestFetchResponse>;

export interface Subscription {
    _created: string;
    _id: string;
    boards: Array<{ _id: string }>;
    installation: Installation;
}

export interface SubscriptionPostResponse {
    message: {
        created: number;
        id: string;
    };
}

export interface Subscriptions {
    subscriptions: Subscription[];
}

export interface Viewer {
    _created: string;
    _id: string;
    installation: {
        _id: string;
    };
    type: string;
}
