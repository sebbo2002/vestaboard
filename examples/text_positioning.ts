import { Message, MessageWritePosition, ReadWriteAPI } from '../src/index.js';

/**
 * This example will create a message that will look like this:
 * You can also use table() to create a layout like this.
 *
 *     #==============================================#
 *     # 1 3 : 0 0   D A I L Y                        #
 *     #                                              #
 *     # 1 8 : 0 0   F I S C H S T A E B C H E N ,    #
 *     #             S P I N A T   &   E I            #
 *     #                                              #
 *     # 2 0 : 0 0   S A N D M A E N N C H E N        #
 *     #==============================================#
 */

const msg = new Message();
const api = new ReadWriteAPI('*** API KEY ***');

msg.write('13:00', {position: MessageWritePosition.NEXT_LINE});
msg.write('Daily', {indent: true});

msg.write('', {position: MessageWritePosition.NEXT_LINE});

msg.write('18:00', {position: MessageWritePosition.NEXT_LINE});
msg.write('Fischstäbchen, Spinat & Ei', {indent: true});

msg.write('', {position: MessageWritePosition.NEXT_LINE});

msg.write('20:00', {position: MessageWritePosition.NEXT_LINE});
msg.write('Sandmännchen', {indent: true});

api.postMessage(msg)
    .then(() => {
        console.log('Message posted on board:');
        console.log(msg.toString());
    })
    .catch(error => {
        console.error(error);
    });
