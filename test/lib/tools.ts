'use strict';

import assert from 'assert';

import { request } from '../../src/tools.js';
import { RequestOptionsFetch } from '../../src/types.js';

describe('Tools', function () {
    this.timeout(30000);

    describe('request', function () {
        it('should work as intended', async function () {
            const fetch: RequestOptionsFetch = async (url, options) => {
                assert.strictEqual(url, 'https://example.com/test');
                assert.deepStrictEqual(options, {
                    headers: {
                        'X-Test-Header': '1337',
                    },
                    method: 'GET',
                });

                return {
                    json: async () => ({ foo: 'bar' }),
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                };
            };

            const response = await request(
                'https://example.com/test',
                {
                    'X-Test-Header': '1337',
                },
                undefined,
                { fetch },
            );

            assert.deepStrictEqual(response, { foo: 'bar' });
        });
        it('should throw error on non 2xx status codes', async function () {
            const fetch: RequestOptionsFetch = async (url, options) => {
                assert.strictEqual(url, 'https://example.com/test');
                assert.deepStrictEqual(options, {
                    headers: {
                        'X-Test-Header': '1337',
                    },
                    method: 'GET',
                });

                return {
                    json: async () => '',
                    ok: false,
                    status: 500,
                    statusText: 'ERROR',
                };
            };

            await assert.rejects(async () => {
                await request(
                    'https://example.com/test',
                    {
                        'X-Test-Header': '1337',
                    },
                    undefined,
                    { fetch },
                );
            }, /HTTP Request failed/);
        });
    });
});
