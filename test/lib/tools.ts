'use strict';

import assert from 'assert';
import { RequestOptionsFetch } from '../../src/types';
import { request } from '../../src/tools';

describe('Tools', function () {
    this.timeout(30000);

    describe('request', function () {
        it('should work as intended', async function () {
            const fetch: RequestOptionsFetch = async (url, options) => {
                assert.strictEqual(url, 'https://example.com/test');
                assert.deepStrictEqual(options, {
                    method: 'GET',
                    headers: {
                        'X-Test-Header': '1337'
                    }
                });

                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => ({ foo: 'bar'})
                };
            };

            const response = await request('https://example.com/test', {
                'X-Test-Header': '1337'
            }, undefined, { fetch });

            assert.deepStrictEqual(response, { foo: 'bar' });
        });
        it('should throw error on non 2xx status codes', async function () {
            const fetch: RequestOptionsFetch = async (url, options) => {
                assert.strictEqual(url, 'https://example.com/test');
                assert.deepStrictEqual(options, {
                    method: 'GET',
                    headers: {
                        'X-Test-Header': '1337'
                    }
                });

                return {
                    ok: false,
                    status: 500,
                    statusText: 'ERROR',
                    json: async () => ('')
                };
            };

            await assert.rejects(async () => {
                await request('https://example.com/test', {
                    'X-Test-Header': '1337'
                }, undefined, { fetch });
            }, /HTTP Request failed/);
        });
    });
});
