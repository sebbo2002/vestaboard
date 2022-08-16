import { Message, ReadWriteAPI } from '../src/index.js';

const msg = new Message('Hello World');
const api = new ReadWriteAPI('*** API KEY ***');

api.postMessage(msg)
    .then(() => {
        console.log('Message posted on board:');
        console.log(msg.toString());
    })
    .catch(error => {
        console.error(error);
    });
