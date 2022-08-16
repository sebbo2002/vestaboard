import SubscriptionAPI from './subscription-api.js';
import ReadWriteAPI from './read-write-api.js';
import LocalAPI from './local-api.js';

export const BOARD_LINE_LENGTH = 22;
export const BOARD_LINES = 6;

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
    number
];

export type BoardCharArray = [
    BoardCharLine,
    BoardCharLine,
    BoardCharLine,
    BoardCharLine,
    BoardCharLine,
    BoardCharLine
];

export interface MessageWriteCoords {
    line: number;
    row?: number;
    width?: number;
}

export enum MessageWritePosition {
    CURRENT,
    NO_SPACE_BETWEEN,
    NEXT_LINE
}

export interface MessageWriteOptions {
    position?: MessageWriteCoords | MessageWritePosition;
    indent?: boolean | number;
    fallbackChar?: number | null;
    removeUnsupportedWords?: boolean;
}

export interface RequestFetchOptions {
    body?: string;
    headers?: Record<string, string>;
    method?: string;
}

export interface RequestFetchResponse {
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    json(): Promise<unknown>;
}

export type RequestOptionsFetch = (url: string, init?: RequestFetchOptions) => Promise<RequestFetchResponse>;

export interface RequestOptions {
    fetch?: RequestOptionsFetch;
    parseResponse?: boolean;
}

export interface Installation {
    _id: string;
    installable?: {
        _id: string;
    };
}

export interface Viewer {
    type: string;
    _id: string;
    _created: string;
    installation: {
        _id: string;
    };
}

export interface Subscription {
    _id: string;
    _created: string;
    installation: Installation;
    boards: Array<{_id: string}>;
}

export interface Subscriptions {
    subscriptions: Subscription[];
}

export interface SubscriptionPostResponse {
    message: {
        id: string;
        created: number;
    }
}

export interface ReadWriteGetMessageResponse {
    currentMessage: {
        layout: string;
    }
}

export type Boards = Array<LocalAPI | ReadWriteAPI | SubscriptionAPI>;
