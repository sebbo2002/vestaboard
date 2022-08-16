import GraphemeSplitter from 'grapheme-splitter';
import { BOARD_LINE_LENGTH, BOARD_LINES, BoardCharArray, MessageWriteOptions, MessageWritePosition } from './types.js';


/**
 * Map with all supported characters plus a few emojis
 * mapped to corresponding characters of the Vestaboard
 */
export const CHAR_MAP: Array<[string, number[]]> = [
    [' ', [0]],
    ['A', [1]],
    ['a', [1]],
    ['b', [2]],
    ['B', [2]],
    ['C', [3]],
    ['c', [3]],
    ['d', [4]],
    ['e', [5]],
    ['f', [6]],
    ['g', [7]],
    ['h', [8]],
    ['i', [9]],
    ['j', [10]],
    ['k', [11]],
    ['l', [12]],
    ['m', [13]],
    ['n', [14]],
    ['o', [15]],
    ['p', [16]],
    ['q', [17]],
    ['r', [18]],
    ['s', [19]],
    ['t', [20]],
    ['u', [21]],
    ['v', [22]],
    ['w', [23]],
    ['x', [24]],
    ['y', [25]],
    ['z', [26]],
    ['D', [4]],
    ['E', [5]],
    ['F', [6]],
    ['G', [7]],
    ['H', [8]],
    ['I', [9]],
    ['J', [10]],
    ['K', [11]],
    ['L', [12]],
    ['M', [13]],
    ['N', [14]],
    ['O', [15]],
    ['P', [16]],
    ['Q', [17]],
    ['R', [18]],
    ['S', [19]],
    ['T', [20]],
    ['U', [21]],
    ['V', [22]],
    ['W', [23]],
    ['X', [24]],
    ['Y', [25]],
    ['Z', [26]],
    ['1', [27]],
    ['2', [28]],
    ['3', [29]],
    ['4', [30]],
    ['5', [31]],
    ['6', [32]],
    ['7', [33]],
    ['8', [34]],
    ['9', [35]],
    ['0', [36]],
    ['!', [37]],
    ['@', [38]],
    ['#', [39]],
    ['$', [40]],
    ['(', [41]],
    [')', [42]],
    ['-', [44]],
    ['+', [46]],
    ['&', [47]],
    ['=', [48]],
    [';', [49]],
    [':', [50]],
    ['\'', [52]],
    ['"', [53]],
    ['%', [54]],
    [',', [55]],
    ['.', [56]],
    ['/', [59]],
    ['?', [60]],
    ['°', [62]],
    ['ä', [1, 5]],
    ['Ä', [1, 5]],
    ['ö', [15, 5]],
    ['Ö', [15, 5]],
    ['ü', [21, 5]],
    ['Ü', [21, 5]],
    ['ß', [19, 19]],
    ['🟥', [63]],
    ['🟧', [64]],
    ['🟨', [65]],
    ['🟩', [66]],
    ['🟦', [67]],
    ['🟪', [68]],
    ['⬜️', [69]],
    ['⬜', [69]],
    ['⬛️', [-2]],
    ['⬛', [-2]],
    ['﹫', [38]],
    ['＠', [38]],
    ['0️⃣', [36]],
    ['1️⃣', [27]],
    ['2️⃣', [28]],
    ['3️⃣', [29]],
    ['4️⃣', [30]],
    ['5️⃣', [31]],
    ['6️⃣', [32]],
    ['7️⃣', [33]],
    ['8️⃣', [34]],
    ['9️⃣', [35]],
    ['❕', [37]],
    ['‼️', [37, 37]],
    ['❗️', [37]],
    ['⁉️', [37, 60]],
    ['#️⃣', [39]],
    ['💲', [40]],
    ['$', [40]],
    ['﹩', [40]],
    ['＄', [40]],
    ['←', [44]],
    ['→', [44]],
    ['➡', [44]],
    ['⬅', [44]],
    ['➔', [44]],
    ['↔', [44]],
    ['–', [44]],
    ['➕', [46]],
    ['+', [46]],
    ['﹪', [54]],
    ['％', [54]],
    ['❓', [60]],
    ['❔', [60]],
    ['℃', [62, 3]],
    ['℉', [62, 6]]
];

const EMPTY_BOARD: BoardCharArray = new Array(BOARD_LINES).fill(
    new Array(BOARD_LINE_LENGTH).fill(0)
) as BoardCharArray;

/**
 * You can build a message like this:
 *
 * ```javascript
 * import { Message } from '@sebbo2002/vestaboard';
 *
 * const myMessage = new Message('Hello World');
 *
 * // same as
 *
 * const myOtherMessage = new Message()
 *     .write('Hello World')
 *     .center();
 * ```
 */
export default class Message {
    private static readonly splitter = new GraphemeSplitter();
    private readonly board: BoardCharArray;
    private cursor = [0, 0];

    constructor (message?: BoardCharArray | string) {
        if(typeof message === 'string' && message) {
            this.board = JSON.parse(JSON.stringify(EMPTY_BOARD));
            this.write(message);
            this.center();
        }
        else if(Array.isArray(message)) {
            this.board = message;
        }
        else {
            this.board = JSON.parse(JSON.stringify(EMPTY_BOARD));
        }
    }

    static string2chars (word: string, options: MessageWriteOptions = {}): number[] {
        let chars: number[] = [];
        const singleCharStrings = Message.splitter.splitGraphemes(word);
        for (const char of singleCharStrings) {
            chars.push(...this.char2char(char));
        }

        // trim emoji words if not disabled
        if (options.removeUnsupportedWords !== false) {
            chars = Message.removeEmojisFromChars(chars);
        }

        // replace -1 with fallback char
        chars = chars.map(char => {
            if (char >= 0) {
                return char;
            } else if (char === -2) {
                return 0;
            } else if (typeof options.fallbackChar === 'number') {
                return options.fallbackChar;
            } else if (options.fallbackChar === null) {
                return -1;
            } else {
                return 60;
            }
        }).filter(char => char >= 0);

        return chars;
    }

    static char2char (char: string): number[] {
        const fromMap = CHAR_MAP
            .find(([mapChar]) => char === mapChar);

        if (fromMap && Array.isArray(fromMap[1])) {
            return fromMap[1];
        }

        return [-1];
    }

    static charToString (char: number): string {
        const entry = Object.values(CHAR_MAP)
            .filter(([name]) => name.length <= 2)
            .find(([, code]) => code[0] === char);

        if (entry) {
            return entry[0].toUpperCase() + (entry[0].length === 1 ? ' ' : '');
        }

        return '⚡︎ ';
    }

    static splitCharsIntoLines (chars: number[], lineLength: [number, number]): Array<number[]> {
        // Array with splitting char (if any) and chars of the word
        const words: Array<[number | null, number[]]> = [];
        for (const char of chars) {
            if (!words.length) {
                words.push([null, []]);
            }

            const currentWord = words[words.length - 1];
            if (char === 0) {
                words.push([0, []]);
            } else if (char === 44) {
                currentWord[1].push(char);
                words.push([null, []]);
            } else {
                currentWord[1].push(char);
            }
        }

        const lines: Array<number[]> = [];
        for (const [separator, word] of words) {
            if (!lines.length) {
                lines.push([]);
            }

            let currentLine = lines[lines.length - 1];
            let charsLeft = lineLength[lines.length === 1 ? 0 : 1] - currentLine.length;

            // start of line, word fits
            if (!currentLine.length && word.length <= charsLeft) {
                currentLine.push(...word);
            }

            // add separator and the whole word
            else if (separator !== null && word.length + 1 <= charsLeft) {
                currentLine.push(0, ...word);
            } else if (word.length <= charsLeft) {
                currentLine.push(...word);
            }

            // no space for the word, write into next line
            else if (word.length <= lineLength[1]) {
                currentLine = [...word];
                charsLeft = lineLength[1];
                lines.push(currentLine);
            }

            // word too long for one line, start in
            // current line and continue in next line
            else {
                if (charsLeft >= 3 && !currentLine.length) {
                    // No space required in front of long word
                } else if (charsLeft >= 4 && currentLine.length) {
                    // Add space for next word
                    currentLine.push(0);
                    charsLeft--;
                } else {
                    // No enough space for word, go to next line
                    currentLine = [];
                    charsLeft = lineLength[1];
                    lines.push(currentLine);
                }

                for (const char of word) {
                    currentLine.push(char);
                    charsLeft--;

                    if (charsLeft <= 1) {
                        currentLine.push(44);

                        currentLine = [];
                        charsLeft = lineLength[1];
                        lines.push(currentLine);
                    }
                }
            }
        }

        return lines;
    }

    static removeEmojisFromChars (chars: number[]): number[] {
        const words: Array<number[]> = [];
        for (const char of chars) {
            if (!words.length) {
                words.push([]);
            }

            if (char === 0) {
                words.push([]);
            } else {
                words[words.length - 1].push(char);
            }
        }

        words.forEach(chars => {
            if (chars.length > 0 && chars[0] === -1) {
                while (chars[0] < 0) {
                    chars.splice(0, 1);
                }
            }
            if (chars.length > 0 && chars[chars.length - 1] === -1) {
                while (chars.length > 0 && chars[chars.length - 1] < 0) {
                    chars.splice(chars.length - 1, 1);
                }
            }
        });

        const result: number[] = [];
        words
            .filter(chars => chars.length > 0)
            .forEach(chars => {
                if (result.length !== 0) {
                    result.push(0);
                }

                result.push(...chars);
            });

        return result;
    }

    static getColumnSizesFromData (rows: Array<string[]>, options: MessageWriteOptions = {}): number[] {
        if (!rows.length) {
            return [];
        }

        const columns = rows[0].length;
        const columnDefaultSizes: number[] = [];
        rows.forEach((row, rowIndex) => {
            if (row.length !== columns) {
                throw new Error(`Unable to render table: Row ${rowIndex} has ${row.length} entries, but first row has ${columns}!`);
            }
            row.forEach((column, columnIndex) => {
                columnDefaultSizes[columnIndex] = Math.max(columnDefaultSizes[columnIndex] || 0, this.string2chars(column, options).length);
            });
        });

        const columnDefaultSum = columnDefaultSizes.reduce((a, b) => a + b, 0);
        const columnBorders = rows[0].length - 1;
        const factor = Math.max((BOARD_LINE_LENGTH - columnBorders) / columnDefaultSum, 1);
        const columnSizes = columnDefaultSizes.map(size => Math.round(size * factor));

        while (true) {
            const size = columnSizes.reduce((a, b) => a + b, 0) + columnBorders;
            if (size === BOARD_LINE_LENGTH) {
                break;
            }

            const diff = BOARD_LINE_LENGTH - size < 0 ? -1 : 1;
            const index = columnSizes.indexOf(diff < 0 ? Math.max(...columnSizes) : Math.min(...columnSizes));
            if(index < 0) {
                // This can actually never be achieved...
                throw new Error('Unable to find max value in array…');
            }

            columnSizes[index] += diff;
        }


        return columnSizes;
    }

    get isEmpty (): boolean {
        return !this.board.find(line =>
            line.find(char => char !== 0)
        );
    }

    /**
     * Fills the board with the passed character or text. The text
     * is repeated again and again until the board is completely filled.
     */
    fill (text = ' '): this {
        let pointer = 0;
        const chars = Message.string2chars(text, {removeUnsupportedWords: false});
        this.board.forEach((line) => {
            line.forEach((char, charIndex) => {
                line[charIndex] = chars[pointer];
                pointer++;

                if(pointer > chars.length - 1) {
                    pointer = 0;
                }
            });
        });
        return this;
    }

    /**
     * Write a text on your new message. If your message is not empty it will continue
     * where you last left off (`position: MessageWritePosition.CURRENT`). Alternatively
     * you can continue on the next line or give an exact position.
     *
     * @param text
     * @param options
     */
    write (text: string, options: MessageWriteOptions = {}): this {

        // Cursor blow board length? Just return…
        if (!this.board[this.cursor[0]]) {
            return this;
        }

        // Add new line if NEXT_LINE is set (except it's already in the first line)
        if (options.position === MessageWritePosition.NEXT_LINE && (this.cursor[0] !== 0 || this.cursor[1] !== 0)) {
            this.cursor[0]++;
            this.cursor[1] = 0;
        }

        // Set cursor to given position
        else if (typeof options.position === 'object') {
            this.cursor[0] = options.position.line;
            this.cursor[1] = options.position.row || 0;
        }

        // Add space before text as it
        // will be rendered in the same line
        if (
            (options.position === undefined || options.position === MessageWritePosition.CURRENT) &&
            this.cursor[1] !== 0 && this.cursor[1] < BOARD_LINE_LENGTH - 1
        ) {
            this.board[this.cursor[0]].splice(this.cursor[1], 1, 0);
            this.cursor[1] += 1;
        }

        // Figure out left indent
        let indent = 0;
        if (options.indent === true) {
            indent = this.cursor[1];
        } else if (typeof options.indent === 'number' && options.indent >= 0 && options.indent <= BOARD_LINE_LENGTH - 5) {
            indent = options.indent;
        }

        const linesOfText = text.split('\n');
        let isFirstLine = true;
        for (const lineOfText of linesOfText) {
            const chars = Message.string2chars(lineOfText, options);
            const charsLeftInLine: [number, number] = [
                BOARD_LINE_LENGTH - this.cursor[1],
                BOARD_LINE_LENGTH - indent
            ];

            if(!isFirstLine) {
                this.cursor[0]++;
                this.cursor[1] = indent;
            }

            if(typeof options.position === 'object' && options.position.width) {
                charsLeftInLine[0] = Math.min(charsLeftInLine[0], options.position.width);
                charsLeftInLine[1] = Math.min(charsLeftInLine[1], options.position.width - indent);
            }

            const linesOfChars = Message.splitCharsIntoLines(chars, charsLeftInLine);
            for (const chars of linesOfChars) {

                // Board is over, skip line…
                if (!this.board[this.cursor[0]]) {
                    break;
                }

                // Add chars to current line and update cursor
                this.board[this.cursor[0]].splice(this.cursor[1], chars.length, ...chars);
                this.cursor[1] += chars.length;

                // Add new line (and update cursor),
                // if this wasn't the last line
                if (chars !== linesOfChars[linesOfChars.length - 1]) {
                    this.cursor[0]++;
                    this.cursor[1] = indent;
                }
            }

            isFirstLine = false;
        }

        return this;
    }

    /**
     * Generate a table with the given data
     *
     * @example new Message().table([
     *     ['now', 'Daily'],
     *     ['13:00', 'Super Secret Meeting'],
     *     ['16:30', 'Awesome Presentation']
     * ])
     *
     * #==============================================#
     * # N O W       D A I L Y                        #
     * #                                              #
     * # 1 3 : 0 0   S U P E R   S E C R E T          #
     * #             M E E T I N G                    #
     * #                                              #
     * # 1 6 : 3 0   A W E S O M E   P R E S E N T -  #
     * #==============================================#
     */
    table (rows: Array<string[]>): this {
        const columnWidths = Message.getColumnSizesFromData(rows);
        if (this.cursor[0] !== 0 || this.cursor[1] !== 0) {
            this.cursor[0]++;
            this.cursor[1] = 0;
        }

        rows.forEach(line => {
            const lineStart = this.cursor[0];
            let lineHeight = 1;

            line.forEach((column, columnIndex) => {
                const columnWidth = columnWidths[columnIndex];
                const indent = columnWidths
                    .filter((width, index) => index < columnIndex)
                    .reduce((a, b) => a + b + 1, 0);

                this.write(column, {
                    position: {
                        line: lineStart,
                        row: indent,
                        width: columnWidth
                    },
                    indent
                });

                lineHeight = Math.max(lineHeight, this.cursor[0] - lineStart + 1);
            });

            this.cursor[0] = lineStart + lineHeight + 1;
            this.cursor[1] = 0;
        });

        return this;
    }

    /**
     * Center the current message content
     */
    center(): void {
        const space = [
            this.board.findIndex(l => l.find(c => c !== 0)),
            Math.min(...this.board.map(l => l.find(c => c !== 0) ? l.slice().reverse().findIndex(c => c !== 0) : l.length)),
            this.board.slice().reverse().findIndex(l => l.find(c => c !== 0)),
            Math.min(...this.board.map(l => l.find(c => c !== 0) ? l.findIndex(c => c !== 0) : l.length)),
        ];

        const padding = [
            Math.floor((space[0] + space[2]) / 2),
            Math.floor((space[1] + space[3]) / 2)
        ];

        // Move up/down
        if(space[0] !== padding[0]) {
            const add = padding[0] - space[0];
            this.board.splice(add > 0 ? 0 : this.board.length, 0,
                ...this.board.splice(add > 0 ? this.board.length - add : 0, Math.abs(add))
            );
        }

        // Move left/right
        if(space[3] !== padding[1]) {
            const add = padding[1] - space[3];
            this.board.forEach(line => {
                line.splice(add > 0 ? 0 : line.length, 0,
                    ...line.splice(add > 0 ? line.length - add : 0, Math.abs(add))
                );
            });
        }
    }

    toString (): string {
        return '#=' + '='.repeat(BOARD_LINE_LENGTH * 2) + '=#\n' +
            this.board.map(line => '# ' + line.map(char =>
                Message.charToString(char)
            ).join('') + ' #\n').join('') +
            '#=' + '='.repeat(BOARD_LINE_LENGTH * 2) + '=#\n';
    }

    toCharArray (): BoardCharArray {
        return JSON.parse(JSON.stringify(this.board));
    }
}
