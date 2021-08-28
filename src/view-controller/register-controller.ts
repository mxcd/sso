import {debug} from "./util";

export enum REGISTER_MESSAGE {
    NO_MESSAGE,
    INVALID_DATA
}

export async function renderRegister(req, res, provider, message) {
    let {uid, prompt, params, session} = await provider.interactionDetails(req, res);
    const client = await provider.Client.find(params.client_id);

    switch(message) {
        case REGISTER_MESSAGE.NO_MESSAGE:
            params.error = false;
            params.message = '';
            break;
        case REGISTER_MESSAGE.INVALID_DATA:
            params.error = true;
            params.message = 'invalid_data'
            break;
    }

    return res.render('register', {
        client,
        uid,
        details: prompt.details,
        params,
        title: 'Register',
        session: session ? debug(session) : undefined,
        dbg: {
            params: debug(params),
            prompt: debug(prompt),
        },
    });
}