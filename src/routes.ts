/* eslint-disable no-console, max-len, camelcase, no-unused-vars */
import {checkUserLogin, createUser, USER_VALIDATION_RESULT, validateUser} from "./controller/UserController";
import {LOGIN_MESSAGE, renderLogin} from "./view-controller/login-controller";
import {REGISTER_MESSAGE, renderRegister} from "./view-controller/register-controller";
import {renderConsent} from "./view-controller/consent-controller";

const { strict: assert } = require('assert');
// const querystring = require('querystring');
// const { inspect } = require('util');

const { urlencoded } = require('express'); // eslint-disable-line import/no-unresolved
const body = urlencoded({ extended: false });


module.exports = (app, provider) => {
    const { constructor: { errors: { SessionNotFound } } } = provider;

    // Use middleware to render layout
    app.use((req, res, next) => {
        const orig = res.render;
        res.render = (view, locals) => {
            app.render(view, locals, (err, html) => {
                if (err) throw err;
                orig.call(res, '_layout', {
                    ...locals,
                    body: html,
                });
            });
        };
        next();
    });

    function setNoCache(req, res, next) {
        res.set('Pragma', 'no-cache');
        res.set('Cache-Control', 'no-cache, no-store');
        next();
    }

    async function confirmAction(interactionDetails) {
        const { prompt: { details }, params, session: { accountId } } = interactionDetails;

        let { grantId } = interactionDetails;
        let grant;

        if (grantId) {
            // we'll be modifying existing grant in existing session
            grant = await provider.Grant.find(grantId);
        } else {
            // we're establishing a new grant
            grant = new provider.Grant({
                accountId,
                clientId: params.client_id,
            });
        }

        if (details.missingOIDCScope) {
            grant.addOIDCScope(details.missingOIDCScope.join(' '));
        }
        if (details.missingOIDCClaims) {
            grant.addOIDCClaims(details.missingOIDCClaims);
        }
        if (details.missingResourceScopes) {
            // eslint-disable-next-line no-restricted-syntax
            for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
                // @ts-ignore
                grant.addResourceScope(indicator, scopes.join(' '));
            }
        }

        grantId = await grant.save();

        const consent = {};
        if (!interactionDetails.grantId) {
            // we don't have to pass grantId to consent, we're just modifying existing one
            // @ts-ignore
            consent.grantId = grantId;
        }
        return consent;
    }

    app.get('/interaction/:uid', setNoCache, async (req, res, next) => {
        try {
            let {prompt: {name}} = await provider.interactionDetails(req, res);
            switch (name) {
                case 'login':
                    // render login page due to GET /login request
                    return await renderLogin(req, res, provider, LOGIN_MESSAGE.NO_MESSAGE);
                case 'consent':
                    const hacky = true;
                    if(hacky) {
                        const interactionDetails = await provider.interactionDetails(req, res);
                        const consent = await confirmAction(interactionDetails);
                        const result = { consent };
                        return await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
                    }
                    else {
                        return await renderConsent(req, res, provider);
                    }
                default:
                    return undefined;
            }
        } catch (err) {
            return next(err);
        }
    });

    // handle login
    app.post('/interaction/:uid/login', setNoCache, body, async (req, res, next) => {
        try {
            const { prompt: { name } } = await provider.interactionDetails(req, res);
            assert.equal(name, 'login');
            const email = req.body.login;
            const password = req.body.password;
            const userResult = await checkUserLogin(email, password);
            if(userResult.valid && userResult.user !== null) {
                const result = {
                    login: {
                        accountId: userResult.user.id,
                    },
                };
                return await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
            }
            else {
                return renderLogin(req, res, provider, LOGIN_MESSAGE.INVALID_LOGIN)
            }
        } catch (err) {
            next(err);
        }
    });

    app.post('/interaction/:uid/confirm', setNoCache, body, async (req, res, next) => {
        try {
            const interactionDetails = await provider.interactionDetails(req, res);
            const consent = await confirmAction(interactionDetails);

            const result = { consent };
            await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
        } catch (err) {
            next(err);
        }
    });

    app.get('/interaction/:uid/abort', setNoCache, async (req, res, next) => {
        try {
            const result = {
                error: 'access_denied',
                error_description: 'End-User aborted interaction',
            };
            await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
        } catch (err) {
            next(err);
        }
    });

    app.get('/interaction/:uid/register', setNoCache, async (req, res, next) => {
        return await renderRegister(req, res, provider, REGISTER_MESSAGE.NO_MESSAGE)
    })

    app.post('/interaction/:uid/register', setNoCache, body, async (req, res, next) => {
        try {
            const { prompt: { name } } = await provider.interactionDetails(req, res);
            console.log(name)
            console.log(`Trying to register ${req.body.email}`)
            const {user, error, message} = await createUser(req.body.email, req.body.password);
            if(error || user === null) {
                next(message);
                return;
            }

            const account = {accountId: user.id}

            const result = {
                login: {
                    accountId: account.accountId,
                },
            };

            await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
        } catch (err) {
            next(err);
        }
    });

    app.get('/validate', async (req, res) => {
        const uid = req.query.uid;
        const code = req.query.code;
        if(!uid)  {
            const msg = `validate link called without uid`
            console.error(msg);
            res.status(400)
            res.send(msg)
            return;
        }
        if(!code) {
            const msg = `validate link called without code`
            console.error(msg);
            res.status(400)
            res.send(msg);
            return;
        }

        console.log(`requested validation for user ${uid} with code ${code}`);
        const result = await validateUser(uid, code);
        // TODO replace http responses with respective UI renderings
        // TODO find a way to redirect to original client URL after successful validation
        if(result === USER_VALIDATION_RESULT.VALIDATED) {
            res.send(`success`)
            return;
        }
        else if(result === USER_VALIDATION_RESULT.ALREADY_VALID) {
            res.status(200)
            res.send(`user already validated`)
        }
        else {
            res.status(400)
            res.send(`invalid`)
        }
    })

    app.use((err, req, res, next) => {
        if (err instanceof SessionNotFound) {
            // handle interaction expired / session not found error
        }
        next(err);
    });
};
