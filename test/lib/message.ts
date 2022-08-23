'use strict';

import assert from 'assert';
import Message, { CHAR_MAP } from '../../src/message.js';
import { MessageWritePosition } from '../../src/types.js';

describe('Message', function () {
    describe('constructor', function () {
        it('should center the message given', function () {
            assert.strictEqual(
                new Message('Hello World').toString(),
                '#==============================================#\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#           H E L L O   W O R L D              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should also support a char array', function () {
            const msg = new Message();
            msg.fill('🟥🟧🟨🟩🟦🟪 ');

            assert.deepStrictEqual(new Message(msg.toCharArray()).toCharArray(), msg.toCharArray());
        });
    });
    describe('static string2chars()', function () {
        it('should work', function () {
            assert.deepStrictEqual(Message.string2chars('Hello'), [8, 5, 12, 12, 15]);
        });
        it('should handle german umlauts', function () {
            assert.deepStrictEqual(Message.string2chars('Käse'), [11, 1, 5, 19, 5]);
        });
        it('should handle color emojis', function () {
            assert.deepStrictEqual(Message.string2chars('🟥🟧🟨🟩🟦🟪⬜⬛'), [63, 64, 65, 66, 67, 68, 69, 0]);
        });
        it('should remove special chars', function () {
            assert.deepStrictEqual(Message.string2chars('H⍷llo', {fallbackChar: null}), [8, 12, 12, 15]);
            assert.deepStrictEqual(Message.string2chars('H⍷llo'), [8, 60, 12, 12, 15]);
        });
        it('should work with all charts defined in CHAR_MAP', function() {
            let text = '';
            const result: number[] = [];
            CHAR_MAP.forEach(([str, chars]) => {
                // assert.strictEqual(char.length, 1, `Char "${char}" has a length of ${char.length}`);

                const actual = Message.string2chars(str, {removeUnsupportedWords: false});
                const expected = chars.length !== 1 || chars[0] !== -2 ? chars : [0];
                assert.deepStrictEqual(actual, expected, `Unable to process char "${str}": string2chars returned ${JSON.stringify(actual)}, but expected result was ${JSON.stringify(expected)}`);

                text += str;
                result.push(...expected);
            });

            assert.deepStrictEqual(Message.string2chars(text, {removeUnsupportedWords: false}), result);
        });
    });
    describe('static splitCharsIntoLines()', function () {
        it('should split words by whitespace', function () {
            const chars = Message.string2chars('Hello World');
            assert.deepEqual(
                Message.splitCharsIntoLines(chars, [22, 22]),
                [
                    [
                        8,
                        5,
                        12,
                        12,
                        15,
                        0,
                        23,
                        15,
                        18,
                        12,
                        4
                    ]
                ]
            );
            assert.deepEqual(
                Message.splitCharsIntoLines(chars, [8, 8]),
                [
                    [
                        8,
                        5,
                        12,
                        12,
                        15
                    ],
                    [
                        23,
                        15,
                        18,
                        12,
                        4
                    ]
                ]
            );
        });
        it('should split words by dash', function () {
            const chars = Message.string2chars('Hello-World');
            assert.deepEqual(
                Message.splitCharsIntoLines(chars, [22, 22]),
                [
                    [
                        8,
                        5,
                        12,
                        12,
                        15,
                        44,
                        23,
                        15,
                        18,
                        12,
                        4
                    ]
                ]
            );
            assert.deepEqual(
                Message.splitCharsIntoLines(chars, [8, 8]),
                [
                    [
                        8,
                        5,
                        12,
                        12,
                        15,
                        44,
                    ],
                    [
                        23,
                        15,
                        18,
                        12,
                        4
                    ]
                ]
            );
        });
        it('should auto-split very long words', function () {
            const chars = Message.string2chars('Rindfleischetikettierungsueberwachungsaufgabenuebertragungsgesetz');
            assert.deepEqual(
                Message.splitCharsIntoLines(chars, [22, 22]),
                [
                    [
                        18,
                        9,
                        14,
                        4,
                        6,
                        12,
                        5,
                        9,
                        19,
                        3,
                        8,
                        5,
                        20,
                        9,
                        11,
                        5,
                        20,
                        20,
                        9,
                        5,
                        18,
                        44
                    ],
                    [
                        21,
                        14,
                        7,
                        19,
                        21,
                        5,
                        2,
                        5,
                        18,
                        23,
                        1,
                        3,
                        8,
                        21,
                        14,
                        7,
                        19,
                        1,
                        21,
                        6,
                        7,
                        44
                    ],
                    [
                        1,
                        2,
                        5,
                        14,
                        21,
                        5,
                        2,
                        5,
                        18,
                        20,
                        18,
                        1,
                        7,
                        21,
                        14,
                        7,
                        19,
                        7,
                        5,
                        19,
                        5,
                        44,
                    ],
                    [
                        20,
                        26
                    ]
                ]
            );
        });
    });
    describe('static removeEmojisFromChars()', function () {
        it('should not trim texts without emoji words', function() {
            assert.deepStrictEqual(Message.string2chars('Hello World'), [
                8,
                5,
                12,
                12,
                15,
                0,
                23,
                15,
                18,
                12,
                4
            ]);
        });
        it('should trim emoji prefixes', function() {
            assert.deepStrictEqual(Message.removeEmojisFromChars(
                Message.string2chars('👋🏼Hello')
            ), [8, 5, 12, 12, 15]);
            assert.deepStrictEqual(Message.removeEmojisFromChars(
                Message.string2chars('👋🏼 Hello')
            ), [8, 5, 12, 12, 15]);
        });
        it('should trim emoji postfixes', function() {
            assert.deepStrictEqual(Message.removeEmojisFromChars(
                Message.string2chars('Hello👋🏼')
            ), [8, 5, 12, 12, 15]);
            assert.deepStrictEqual(Message.removeEmojisFromChars(
                Message.string2chars('Hello 👋🏼')
            ), [8, 5, 12, 12, 15]);
        });
        it('should trim emoji words', function() {
            assert.deepStrictEqual(Message.removeEmojisFromChars(
                Message.string2chars('Hello 👋🏼👋🏼 World')
            ), [8, 5, 12, 12, 15, 0, 23, 15, 18, 12, 4]);
        });
    });
    describe('static getColumnSizesFromData()', function () {
        it('should work with a very basic example', function () {
            assert.deepStrictEqual(Message.getColumnSizesFromData([
                ['now', 'Daily'],
                ['13:00', 'Secret Meeting']
            ]), [6, 15]);
        });
        it('should work without data', function () {
            assert.deepStrictEqual(Message.getColumnSizesFromData([]), []);
        });
        it('should work with only one column', function () {
            assert.deepStrictEqual(Message.getColumnSizesFromData([
                ['Daily'],
                ['Secret Meeting']
            ]), [22]);
        });
        it('should work if length is not enough', function () {
            assert.deepStrictEqual(Message.getColumnSizesFromData([
                ['now', 'Daily'],
                ['13:00', 'Super Secret Meeting']
            ]), [5, 16]);
        });
        it('should throw error if rows have different number of columns', function () {
            assert.throws(() => {
                new Message().table([
                    ['now', 'Daily'],
                    ['13:00', 'Secret Meeting', '🟥']
                ]);
            }, /Unable to render table: Row 1 has 3 entries, but first row has 2!/);
        });
    });
    describe('get isEmpty', function () {
        const message = new Message();
        assert.deepEqual(message.isEmpty, true);

        message.write('Hello');
        assert.deepEqual(message.isEmpty, false);
    });
    describe('fill()', function () {
        it('should work with default', function () {
            const msg = new Message();
            msg.write('Hello World');
            msg.fill();

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should work with single chars', function () {
            const msg = new Message();
            msg.fill('🟥');

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '# 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 #\n' +
                '# 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 #\n' +
                '# 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 #\n' +
                '# 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 #\n' +
                '# 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 #\n' +
                '# 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 #\n' +
                '#==============================================#\n'
            );
        });
        it('should work with multiple chars', function () {
            const msg = new Message();
            msg.fill('🟥🟧🟨🟩🟦🟪');

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '# 🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩 #\n' +
                '# 🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧 #\n' +
                '# 🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪 #\n' +
                '# 🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩 #\n' +
                '# 🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧 #\n' +
                '# 🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪 #\n' +
                '#==============================================#\n'
            );
        });
    });
    describe('write()', function () {
        it('should start writing from top/left', function () {
            const msg = new Message();
            msg.write('Hello World');

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '# H E L L O   W O R L D                        #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should accept line & row for positioning', function () {
            const msg = new Message();
            msg.write('Hello World', {
                position: {
                    line: 2,
                    row: 5
                }
            });

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#           H E L L O   W O R L D              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should add another line if text is too long', function () {
            const msg = new Message();
            msg.write(
                'Lorem ipsum dolor sit amet, ' +
                'consetetur sadipscing elitr, sed ' +
                'diam nonumy eirmod tempor invidunt'
            );

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '# L O R E M   I P S U M   D O L O R   S I T    #\n' +
                '# A M E T ,   C O N S E T E T U R              #\n' +
                '# S A D I P S C I N G   E L I T R ,   S E D    #\n' +
                '# D I A M   N O N U M Y   E I R M O D          #\n' +
                '# T E M P O R   I N V I D U N T                #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should work with words > board length', function () {
            const msg = new Message();
            msg.write('Lorem-ipsum-dolor-sit-amet');

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '# L O R E M - I P S U M - D O L O R - S I T -  #\n' +
                '# A M E T                                      #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should allow to use NEXT_LINE flag', function () {
            const msg = new Message();
            msg.write('13:00', {position: MessageWritePosition.NEXT_LINE});
            msg.write('Daily', {indent: true});

            msg.write('', {position: MessageWritePosition.NEXT_LINE});

            msg.write('18:00', {position: MessageWritePosition.NEXT_LINE});
            msg.write('Fischstäbchen, Spinat & Ei', {indent: true});

            msg.write('', {position: MessageWritePosition.NEXT_LINE});

            msg.write('20:00', {position: MessageWritePosition.NEXT_LINE});
            msg.write('Sandmännchen', {indent: true});

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '# 1 3 : 0 0   D A I L Y                        #\n' +
                '#                                              #\n' +
                '# 1 8 : 0 0   F I S C H S T A E B C H E N ,    #\n' +
                '#             S P I N A T   &   E I            #\n' +
                '#                                              #\n' +
                '# 2 0 : 0 0   S A N D M A E N N C H E N        #\n' +
                '#==============================================#\n'
            );
        });
        it('should support the NO_SPACE_BETWEEN flag', function () {
            const msg = new Message();
            msg.write('Rindfleisch')
                .write('etikettierungs', {position: MessageWritePosition.NO_SPACE_BETWEEN})
                .write('ueberwachungs', {position: MessageWritePosition.NO_SPACE_BETWEEN})
                .write('aufgaben', {position: MessageWritePosition.NO_SPACE_BETWEEN})
                .write('uebertragungs', {position: MessageWritePosition.NO_SPACE_BETWEEN})
                .write('gesetz', {position: MessageWritePosition.NO_SPACE_BETWEEN})
                .write('(das)');

            assert.strictEqual(
                msg.toString(),
                '#==============================================#\n' +
                '# R I N D F L E I S C H                        #\n' +
                '# E T I K E T T I E R U N G S                  #\n' +
                '# U E B E R W A C H U N G S A U F G A B E N    #\n' +
                '# U E B E R T R A G U N G S G E S E T Z        #\n' +
                '# ( D A S )                                    #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should support \\n', function () {
            assert.strictEqual(
                new Message()
                    .write('Hello\nWorld')
                    .toString(),
                '#==============================================#\n' +
                '# H E L L O                                    #\n' +
                '# W O R L D                                    #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
            assert.strictEqual(
                new Message()
                    .write('H⍷llo World', {fallbackChar: 0})
                    .toString(),
                '#==============================================#\n' +
                '# H   L L O   W O R L D                        #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
            assert.strictEqual(
                new Message()
                    .write('H⍷llo World', {fallbackChar: null})
                    .toString(),
                '#==============================================#\n' +
                '# H L L O   W O R L D                          #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should handle the fallback char', function () {
            assert.strictEqual(
                new Message()
                    .write('H⍷llo World')
                    .toString(),
                '#==============================================#\n' +
                '# H ? L L O   W O R L D                        #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
            assert.strictEqual(
                new Message()
                    .write('H⍷llo World', {fallbackChar: 0})
                    .toString(),
                '#==============================================#\n' +
                '# H   L L O   W O R L D                        #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
            assert.strictEqual(
                new Message()
                    .write('H⍷llo World', {fallbackChar: null})
                    .toString(),
                '#==============================================#\n' +
                '# H L L O   W O R L D                          #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should remove unsupported words by default', function () {
            const msg = new Message();
            msg.write('💪🏼 Gym');

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '# G Y M                                        #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should not break if message is way too long', function () {
            const msg = new Message();
            msg.write('Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.');
            msg.write('Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat.');
            msg.write('Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.');
            msg.write('Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '# L O R E M   I P S U M   D O L O R   S I T    #\n' +
                '# A M E T ,   C O N S E C T E T U R            #\n' +
                '# A D I P I S I C I   E L I T ,   S E D        #\n' +
                '# E I U S M O D   T E M P O R I N C I D U N T  #\n' +
                '# U T   L A B O R E   E T   D O L O R E        #\n' +
                '# M A G N A   A L I Q U A .   U T   E N I M    #\n' +
                '#==============================================#\n'
            );
        });
    });
    describe('table()', function () {
        it('should work with a very basic example', function () {
            const msg = new Message();
            msg.table([
                ['now', 'Daily'],
                ['13:00', 'Secret Meeting']
            ]);

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '# N O W         D A I L Y                      #\n' +
                '#                                              #\n' +
                '# 1 3 : 0 0     S E C R E T   M E E T I N G    #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should just fill the space available if too full', function () {
            const msg = new Message();
            msg.table([
                ['now', 'Daily'],
                ['13:00', 'Super Secret Meeting'],
                ['16:30', 'Awesome Presentation']
            ]);

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '# N O W       D A I L Y                        #\n' +
                '#                                              #\n' +
                '# 1 3 : 0 0   S U P E R   S E C R E T          #\n' +
                '#             M E E T I N G                    #\n' +
                '#                                              #\n' +
                '# 1 6 : 3 0   A W E S O M E   P R E S E N T -  #\n' +
                '#==============================================#\n'
            );
        });
        it('should pay attention to the cursor', function () {
            const msg = new Message();
            msg.write('Hello World\n');
            msg.table([
                ['now', 'Daily'],
                ['13:00', 'Secret Meeting']
            ]);

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '# H E L L O   W O R L D                        #\n' +
                '#                                              #\n' +
                '# N O W         D A I L Y                      #\n' +
                '#                                              #\n' +
                '# 1 3 : 0 0     S E C R E T   M E E T I N G    #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should throw error if rows have different number of columns', function () {
            const msg = new Message();

            assert.throws(() => {
                msg.table([
                    ['now', 'Daily'],
                    ['13:00', 'Secret Meeting', '🟥']
                ]);
            }, /Unable to render table: Row 1 has 3 entries, but first row has 2!/);
        });
    });
    describe('center()', function () {
        it('should work with a single word', function() {
            const msg = new Message();
            msg.write('Hello World');
            msg.center();

            assert.strictEqual(
                msg.toString(),
                '#==============================================#\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#           H E L L O   W O R L D              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
        it('should work with a complete filled board', function () {
            const msg = new Message();
            msg.fill('🟥');
            msg.center();

            assert.strictEqual(msg.toString(),
                '#==============================================#\n' +
                '# 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 #\n' +
                '# 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 #\n' +
                '# 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 #\n' +
                '# 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 #\n' +
                '# 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 #\n' +
                '# 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 #\n' +
                '#==============================================#\n'
            );
        });
        it('should also work if word is not top/left aligned', function () {
            const msg = new Message();
            msg.write('Hello World', {
                position: {
                    line: 5,
                    row: 11
                }
            });
            msg.center();

            assert.strictEqual(
                msg.toString(),
                '#==============================================#\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#           H E L L O   W O R L D              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#                                              #\n' +
                '#==============================================#\n'
            );
        });
    });
});
