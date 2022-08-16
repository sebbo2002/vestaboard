import { Message, SubscriptionAPI } from '../src/index.js';

const msg = new Message().fill('🟥🟧🟨🟩🟦🟪');
const api = new SubscriptionAPI('*** API KEY ***', '*** API SECRET ***');

api.postMessage(msg)
    .then(() => {
        console.log('Message posted on board:');
        console.log(msg.toString());
    })
    .catch(error => {
        console.error(error);
    });
