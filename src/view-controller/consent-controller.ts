import {debug} from "./util";

export async function renderConsent(req, res, provider) {
    let {uid, prompt, params, session} = await provider.interactionDetails(req, res);
    const client = await provider.Client.find(params.client_id);

    return res.render('interaction', {
        client,
        uid,
        details: prompt.details,
        params,
        title: 'Authorize',
        session: session ? debug(session) : undefined,
        dbg: {
            params: debug(params),
            prompt: debug(prompt),
        },
    });
}