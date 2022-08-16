'use strict';

import 'dotenv/config';
import assert from 'assert';
import LocalAPI from '../../src/local-api.js';
import Message from '../../src/message.js';
import { RequestOptionsFetch } from '../../src/types.js';

const RUN_INTEGRATION_TESTS = process.env.VESTABOARD_LOCAL_KEY;

describe('LocalAPI', function () {
    this.timeout(30000);

    describe('getCurrentMessage()', function () {
        it('should work (mocked by device)', async function () {
            const msg = new Message();
            msg.fill('🟥🟧🟨🟩🟦🟪');

            const fetch: RequestOptionsFetch = async (url, options) => {
                assert.strictEqual(url, 'http://vestaboard.local:7000/local-api/message');
                assert.deepStrictEqual(options, {
                    method: 'GET',
                    headers: {
                        'X-Vestaboard-Local-Api-Key': '3eadf7a8-6602-4bf5-92f4-970d36066958'
                    }
                });

                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => ({
                        message: msg.toCharArray()
                    })
                };
            };

            const api = new LocalAPI(
                '3eadf7a8-6602-4bf5-92f4-970d36066958',
                undefined,
                { fetch }
            );

            const result = await api.getCurrentMessage();
            assert.deepStrictEqual(result.toCharArray(), msg.toCharArray());
        });
        it('should work (mocked by docs)', async function () {
            const msg = new Message();
            msg.fill('🟥🟧🟨🟩🟦🟪');

            const fetch: RequestOptionsFetch = async (url, options) => {
                assert.strictEqual(url, 'http://vestaboard.local:7000/local-api/message');
                assert.deepStrictEqual(options, {
                    method: 'GET',
                    headers: {
                        'X-Vestaboard-Local-Api-Key': '3eadf7a8-6602-4bf5-92f4-970d36066958'
                    }
                });

                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => msg.toCharArray()
                };
            };

            const api = new LocalAPI(
                '3eadf7a8-6602-4bf5-92f4-970d36066958',
                undefined,
                { fetch }
            );

            const result = await api.getCurrentMessage();
            assert.deepStrictEqual(result.toCharArray(), msg.toCharArray());
        });
        it('should work (live)', RUN_INTEGRATION_TESTS ? async function () {
            if (!process.env.VESTABOARD_LOCAL_KEY) {
                return;
            }

            const api = new LocalAPI(process.env.VESTABOARD_LOCAL_KEY, process.env.VESTABOARD_LOCAL_HOST);
            const msg = await api.getCurrentMessage();
            assert.strictEqual(msg.isEmpty, false);
        } : undefined);
    });
    describe('postMessage()', function () {
        it('should work (mocked)', async function () {
            const msg = new Message('Hello World');
            const fetch: RequestOptionsFetch = async (url, options) => {
                assert.strictEqual(url, 'http://vestaboard.local:7000/local-api/message');
                assert.deepStrictEqual(options, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Vestaboard-Local-Api-Key': '3eadf7a8-6602-4bf5-92f4-970d36066958'
                    },
                    body: JSON.stringify(msg.toCharArray())
                });

                return {
                    ok: true,
                    status: 201,
                    statusText: 'CREATED',
                    json: async () => ('')
                };
            };

            const api = new LocalAPI(
                '3eadf7a8-6602-4bf5-92f4-970d36066958',
                undefined,
                { fetch }
            );

            await api.postMessage('Hello World');
        });
        it('should work (live)', RUN_INTEGRATION_TESTS ? async function () {
            if (!process.env.VESTABOARD_LOCAL_KEY) {
                return;
            }

            const api = new LocalAPI(process.env.VESTABOARD_LOCAL_KEY, process.env.VESTABOARD_LOCAL_HOST);
            const msg = new Message();
            msg.fill('🟥🟧🟨🟩🟦🟪');

            await api.postMessage(msg);
        } : undefined);
    });
});
