'use strict';

import 'dotenv/config';
import assert from 'assert';
import Message from '../../src/message';
import SubscriptionAPI from '../../src/subscription-api';
import { RequestOptionsFetch, Subscriptions, Viewer } from '../../src/types';

const RUN_INTEGRATION_TESTS = process.env.VESTABOARD_SUBSCRIPTION_KEY && process.env.VESTABOARD_SUBSCRIPTION_SECRET;

describe('SubscriptionAPI', function () {
    this.timeout(30000);

    describe('getViewer()', function () {
        it('should work (mocked)', async function () {
            const msg = new Message();
            msg.fill('🟥🟧🟨🟩🟦🟪');

            const json: Viewer = {
                type: 'installation',
                _id: 'f35032ce-fd2b-4afb-8a24-d71c8085303c',
                _created: '1577829607582',
                installation: {
                    _id: '562038d1-6fdb-4ba5-ae8b-bc9ec882178d'
                }
            };
            const fetch: RequestOptionsFetch = async (url, options) => {
                assert.strictEqual(url, 'https://platform.vestaboard.com/viewer');
                assert.deepStrictEqual(options, {
                    method: 'GET',
                    headers: {
                        'X-Vestaboard-Api-Key': '3eadf7a8-6602-4bf5-92f4-970d36066958',
                        'X-Vestaboard-Api-Secret': '******************************'
                    }
                });

                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => json
                };
            };

            const api = new SubscriptionAPI(
                '3eadf7a8-6602-4bf5-92f4-970d36066958',
                '******************************',
                { fetch }
            );

            const result = await api.getViewer();
            assert.deepStrictEqual(result, json);
        });
        it('should work (live)', RUN_INTEGRATION_TESTS ? async function () {
            if (!process.env.VESTABOARD_SUBSCRIPTION_KEY || !process.env.VESTABOARD_SUBSCRIPTION_SECRET) {
                return;
            }

            const msg = new Message();
            msg.fill('🟥🟧🟨🟩🟦🟪');

            const api = new SubscriptionAPI(
                process.env.VESTABOARD_SUBSCRIPTION_KEY,
                process.env.VESTABOARD_SUBSCRIPTION_SECRET
            );

            const result = await api.getViewer();
            assert.strictEqual(typeof result, 'object');
            assert.strictEqual(typeof result.type, 'string');
            assert.strictEqual(typeof result._id, 'string');
            assert.strictEqual(typeof result._created, 'string');
            assert.strictEqual(typeof result.installation, 'object');
            assert.strictEqual(typeof result.installation._id, 'string');
        } : undefined);
    });
    describe('getSubscription()', function () {
        it('should work (mocked)', async function () {
            const json: Subscriptions = {
                subscriptions: [
                    {
                        _id: 'bc6412b3-3aa6-4684-8962-cd2876942c0d',
                        _created: '1577833654294',
                        installation: {
                            _id: 'fefb8778-9500-4522-b115-29c0dd13c402',
                            installable: {
                                _id: 'b629d7df-7ecb-4460-b51e-f87fa942f113'
                            }
                        },
                        boards: [{
                            _id: 'a1e866f2-e77e-45d8-997a-2e3ebeff4961'
                        }]
                    }
                ]
            };
            const fetch: RequestOptionsFetch = async (url, options) => {
                assert.strictEqual(url, 'https://platform.vestaboard.com/subscriptions');
                assert.deepStrictEqual(options, {
                    method: 'GET',
                    headers: {
                        'X-Vestaboard-Api-Key': '3eadf7a8-6602-4bf5-92f4-970d36066958',
                        'X-Vestaboard-Api-Secret': '******************************'
                    }
                });

                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => json
                };
            };

            const api = new SubscriptionAPI(
                '3eadf7a8-6602-4bf5-92f4-970d36066958',
                '******************************',
                { fetch }
            );

            const result = await api.getSubscriptions();
            assert.deepStrictEqual(result, json);
        });
        it('should work (live)', RUN_INTEGRATION_TESTS ? async function () {
            if (!process.env.VESTABOARD_SUBSCRIPTION_KEY || !process.env.VESTABOARD_SUBSCRIPTION_SECRET) {
                return;
            }

            const api = new SubscriptionAPI(
                process.env.VESTABOARD_SUBSCRIPTION_KEY,
                process.env.VESTABOARD_SUBSCRIPTION_SECRET
            );

            const result = await api.getSubscriptions();
            assert.strictEqual(typeof result, 'object');
            assert.strictEqual(Array.isArray(result.subscriptions), true);
            result.subscriptions.forEach(subscription => {
                assert.strictEqual(typeof subscription._id, 'string');
                assert.strictEqual(typeof subscription._created, 'string');
                assert.strictEqual(typeof subscription.installation, 'object');
                assert.strictEqual(typeof subscription.installation._id, 'string');
                assert.strictEqual(typeof subscription.installation.installable, 'object');
                assert.strictEqual(typeof subscription.installation.installable?._id, 'string');

                assert.strictEqual(Array.isArray(subscription.boards), true);
                subscription.boards.forEach(board => {
                    assert.strictEqual(typeof board, 'object');
                    assert.strictEqual(typeof board._id, 'string');
                });
            });
        } : undefined);
    });
    describe('postMessage()', function () {
        it('should work (single mode)', async function () {
            const msg = new Message();
            msg.fill('🟥🟧🟨🟩🟦🟪');

            const fetch: RequestOptionsFetch = async (url, options) => {
                assert.strictEqual(url, 'https://platform.vestaboard.com/subscriptions/foo/message');
                assert.deepStrictEqual(options, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Vestaboard-Api-Key': '3eadf7a8-6602-4bf5-92f4-970d36066958',
                        'X-Vestaboard-Api-Secret': '******************************'
                    },
                    body: JSON.stringify({ characters: msg.toCharArray() })
                });

                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => ({
                        message: {
                            id: '',
                            created: 1
                        }
                    })
                };
            };

            const api = new SubscriptionAPI(
                '3eadf7a8-6602-4bf5-92f4-970d36066958',
                '******************************',
                { fetch }
            );

            const result = await api.postMessage(msg, 'foo');
            assert.deepStrictEqual(result, {
                message: {
                    id: '',
                    created: 1
                }
            });
        });
        it('should work (multi mode)', async function () {
            const fetch: RequestOptionsFetch = async (url, options) => {
                const msg = new Message('Hello World');

                assert.strictEqual(url, 'https://platform.vestaboard.com/subscriptions/foo/message');
                assert.deepStrictEqual(options, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Vestaboard-Api-Key': '3eadf7a8-6602-4bf5-92f4-970d36066958',
                        'X-Vestaboard-Api-Secret': '******************************'
                    },
                    body: JSON.stringify({ characters: msg.toCharArray() })
                });

                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => ({
                        message: {
                            id: '',
                            created: 1
                        }
                    })
                };
            };

            const api = new SubscriptionAPI(
                '3eadf7a8-6602-4bf5-92f4-970d36066958',
                '******************************',
                { fetch }
            );

            const result = await api.postMessage('Hello World', ['foo', 'foo']);
            assert.deepStrictEqual(result, [
                {
                    message: {
                        id: '',
                        created: 1
                    }
                },
                {
                    message: {
                        id: '',
                        created: 1
                    }
                }
            ]);
        });
        it('should work (live)', RUN_INTEGRATION_TESTS ? async function () {
            if (!process.env.VESTABOARD_SUBSCRIPTION_KEY || !process.env.VESTABOARD_SUBSCRIPTION_SECRET) {
                return;
            }


            const msg = new Message();
            msg.fill('🟥🟧🟨🟩🟦🟪');

            const api = new SubscriptionAPI(
                process.env.VESTABOARD_SUBSCRIPTION_KEY,
                process.env.VESTABOARD_SUBSCRIPTION_SECRET
            );

            const result = await api.postMessage(msg);
            assert.strictEqual(Array.isArray(result), true);
            result.forEach(message => {
                assert.strictEqual(typeof message, 'object');
                assert.strictEqual(typeof message.message, 'object');
                assert.strictEqual(typeof message.message.id, 'string');
                assert.strictEqual(typeof message.message.created, 'number');
            });
        } : undefined);
    });
});
