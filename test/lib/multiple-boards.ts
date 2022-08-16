'use strict';

import 'dotenv/config';
import LocalAPI from '../../src/local-api';
import ReadWriteAPI from '../../src/read-write-api';
import MultipleBoards from '../../src/multiple-boards';

const RUN_INTEGRATION_TESTS = process.env.VESTABOARD_LOCAL_KEY && process.env.VESTABOARD_READ_WRITE_KEY;

describe('MultipleBoard', function () {
    this.timeout(30000);

    describe('postMessage()', function () {
        it('should work (live)', RUN_INTEGRATION_TESTS ? async function () {
            if (!process.env.VESTABOARD_LOCAL_KEY || !process.env.VESTABOARD_READ_WRITE_KEY) {
                return;
            }

            new MultipleBoards();
            const boards = new MultipleBoards([
                new LocalAPI(process.env.VESTABOARD_LOCAL_KEY, process.env.VESTABOARD_LOCAL_HOST)
            ]);

            boards.push(new ReadWriteAPI(process.env.VESTABOARD_READ_WRITE_KEY));

            await boards.postMessage('Hello World');
        } : undefined);
    });
});
