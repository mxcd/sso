import {debug} from "./util";

export enum LOGIN_MESSAGE {
    NO_MESSAGE,
    INVALID_LOGIN
}

export async function renderLogin(req,res, provider, message) {
    let {uid, prompt, params, session} = await provider.interactionDetails(req, res);
    const client = await provider.Client.find(params.client_id);

    switch(message) {
        case LOGIN_MESSAGE.NO_MESSAGE:
            params.error = false;
            params.message = '';
            break;
        case LOGIN_MESSAGE.INVALID_LOGIN:
            params.error = true;
            params.message = 'invalid_login'
            break;
    }

    if(req.body && req.body.login) {
        params.email = req.body.login;
    }

    return res.render('login', {
        client,
        uid,
        details: prompt.details,
        params,
        title: 'Login',
        session: session ? debug(session) : undefined,
        dbg: {
            params: debug(params),
            prompt: debug(prompt),
        },
    });
}