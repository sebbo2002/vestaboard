import { Message, LocalAPI } from '../src/index.js';

const api = new LocalAPI('*** LOCAL KEY ***', 'vestaboard.local');
const msg = new Message().table([
    ['now', 'Daily'],
    ['13:00', 'Super Secret Meeting'],
    ['16:30', 'Awesome Presentation']
]);

api.postMessage(msg)
    .then(() => {
        console.log('Message posted on board:');
        console.log(msg.toString());
    })
    .catch(error => {
        console.error(error);
    });
