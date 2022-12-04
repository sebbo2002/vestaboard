import { Boards } from './types.js';
import Message from './message.js';

export default class MultipleBoards {
    private readonly boards: Boards;

    constructor (boards: Boards = []) {
        this.boards = boards;
    }

    push(...boards: Boards): void {
        boards.forEach(board => this.boards.push(board));
    }

    async postMessage (message: Message | string): Promise<void> {
        for(const board of this.boards) {
            await board.postMessage(message);
        }
    }
}
