import Message from './message.js';
import { type Boards } from './types.js';

export default class MultipleBoards {
    private readonly boards: Boards;

    constructor(boards: Boards = []) {
        this.boards = boards;
    }

    async postMessage(message: Message | string): Promise<void> {
        for (const board of this.boards) {
            await board.postMessage(message);
        }
    }

    push(...boards: Boards): void {
        boards.forEach((board) => this.boards.push(board));
    }
}
