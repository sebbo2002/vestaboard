import { Message, SubscriptionAPI, LocalAPI, MultipleBoards } from '../src/index.js';

const msg = new Message().fill('🟥🟧🟨🟩🟦🟪');
const board1 = new SubscriptionAPI('*** API KEY ***', '*** API SECRET ***');
const board2 = new LocalAPI('*** API KEY ***');
const boards = new MultipleBoards([board1, board2]);

boards.postMessage(msg)
    .then(() => {
        console.log('Message posted on all boards:');
        console.log(msg.toString());
    })
    .catch(error => {
        console.error(error);
    });
