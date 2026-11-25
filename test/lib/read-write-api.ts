'use strict';

import 'dotenv/config';
import assert from 'assert';

import Message from '../../src/message.js';
import ReadWriteAPI from '../../src/read-write-api.js';
import {
    ReadWriteGetMessageResponse,
    RequestOptionsFetch,
} from '../../src/types.js';

const RUN_INTEGRATION_TESTS = process.env.VESTABOARD_READ_WRITE_KEY;

describe('ReadWriteAPI', function () {
    this.timeout(30000);

    describe('getCurrentMessage()', function () {
        it('should work (mocked)', async function () {
            const msg = new Message();
            msg.fill('🟥🟧🟨🟩🟦🟪');

            const json: ReadWriteGetMessageResponse = {
                currentMessage: {
                    layout: JSON.stringify(msg.toCharArray()),
                },
            };
            const fetch: RequestOptionsFetch = async (url, options) => {
                assert.strictEqual(url, 'https://rw.vestaboard.com/');
                assert.deepStrictEqual(options, {
                    headers: {
                        'X-Vestaboard-Read-Write-Key':
                            '3eadf7a8-6602-4bf5-92f4-970d36066958',
                    },
                    method: 'GET',
                });

                return {
                    json: async () => json,
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                };
            };

            const api = new ReadWriteAPI(
                '3eadf7a8-6602-4bf5-92f4-970d36066958',
                { fetch },
            );

            const result = await api.getCurrentMessage();
            assert.deepStrictEqual(result.toCharArray(), msg.toCharArray());
        });
        it(
            'should work (live)',
            RUN_INTEGRATION_TESTS
                ? async function () {
                      if (!process.env.VESTABOARD_READ_WRITE_KEY) {
                          return;
                      }

                      const api = new ReadWriteAPI(
                          process.env.VESTABOARD_READ_WRITE_KEY,
                      );
                      const msg = await api.getCurrentMessage();
                      assert.strictEqual(msg.isEmpty, false);
                  }
                : undefined,
        );
    });
    describe('postMessage()', function () {
        it('should work (mocked)', async function () {
            const msg = new Message();
            msg.fill('🟥🟧🟨🟩🟦🟪');

            const fetch: RequestOptionsFetch = async (url, options) => {
                assert.strictEqual(url, 'https://rw.vestaboard.com/');
                assert.deepStrictEqual(options, {
                    body: JSON.stringify(msg.toCharArray()),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Vestaboard-Read-Write-Key':
                            '3eadf7a8-6602-4bf5-92f4-970d36066958',
                    },
                    method: 'POST',
                });

                return {
                    json: async () => ({
                        status: 'ok',
                    }),
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                };
            };

            const api = new ReadWriteAPI(
                '3eadf7a8-6602-4bf5-92f4-970d36066958',
                { fetch },
            );

            await api.postMessage(msg);
        });
        it(
            'should work (live)',
            RUN_INTEGRATION_TESTS
                ? async function () {
                      if (!process.env.VESTABOARD_READ_WRITE_KEY) {
                          return;
                      }

                      const board = new ReadWriteAPI(
                          process.env.VESTABOARD_READ_WRITE_KEY,
                      );
                      await board.postMessage('Hello World');
                  }
                : undefined,
        );
    });
});
