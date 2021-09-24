/*
* Example configuration
* !! CHANGE KEYS AND SECRETS IN PRODUCTION !!
*/

const config =  {
    scopes: [
        'openid',
        'offline_access'
    ],
    clients: [
        {
            client_id: "oidc_test_id",
            client_secret: "oidc_test_secret",
            redirect_uris: ["https://localhost:8000/secure/redirect_uri"],
            grant_types: [
                "authorization_code",
                "refresh_token"
            ]
        }
    ],
    cookies: {
        keys: ['idIXiSyBMZ9y15JilKDoFLV59MjhJKft'],
    },
    features: {
        devInteractions: { enabled: false }, // defaults to true
        deviceFlow: { enabled: true }, // defaults to false
        revocation: { enabled: true }, // defaults to false
    },
    jwks: {
        keys: [
            {
                d: 'VEZOsY07JTFzGTqv6cC2Y32vsfChind2I_TTuvV225_-0zrSej3XLRg8iE_u0-3GSgiGi4WImmTwmEgLo4Qp3uEcxCYbt4NMJC7fwT2i3dfRZjtZ4yJwFl0SIj8TgfQ8ptwZbFZUlcHGXZIr4nL8GXyQT0CK8wy4COfmymHrrUoyfZA154ql_OsoiupSUCRcKVvZj2JHL2KILsq_sh_l7g2dqAN8D7jYfJ58MkqlknBMa2-zi5I0-1JUOwztVNml_zGrp27UbEU60RqV3GHjoqwI6m01U7K0a8Q_SQAKYGqgepbAYOA-P4_TLl5KC4-WWBZu_rVfwgSENwWNEhw8oQ',
                dp: 'E1Y-SN4bQqX7kP-bNgZ_gEv-pixJ5F_EGocHKfS56jtzRqQdTurrk4jIVpI-ZITA88lWAHxjD-OaoJUh9Jupd_lwD5Si80PyVxOMI2xaGQiF0lbKJfD38Sh8frRpgelZVaK_gm834B6SLfxKdNsP04DsJqGKktODF_fZeaGFPH0',
                dq: 'F90JPxevQYOlAgEH0TUt1-3_hyxY6cfPRU2HQBaahyWrtCWpaOzenKZnvGFZdg-BuLVKjCchq3G_70OLE-XDP_ol0UTJmDTT-WyuJQdEMpt_WFF9yJGoeIu8yohfeLatU-67ukjghJ0s9CBzNE_LrGEV6Cup3FXywpSYZAV3iqc',
                e: 'AQAB',
                kty: 'RSA',
                n: 'xwQ72P9z9OYshiQ-ntDYaPnnfwG6u9JAdLMZ5o0dmjlcyrvwQRdoFIKPnO65Q8mh6F_LDSxjxa2Yzo_wdjhbPZLjfUJXgCzm54cClXzT5twzo7lzoAfaJlkTsoZc2HFWqmcri0BuzmTFLZx2Q7wYBm0pXHmQKF0V-C1O6NWfd4mfBhbM-I1tHYSpAMgarSm22WDMDx-WWI7TEzy2QhaBVaENW9BKaKkJklocAZCxk18WhR0fckIGiWiSM5FcU1PY2jfGsTmX505Ub7P5Dz75Ygqrutd5tFrcqyPAtPTFDk8X1InxkkUwpP3nFU5o50DGhwQolGYKPGtQ-ZtmbOfcWQ',
                p: '5wC6nY6Ev5FqcLPCqn9fC6R9KUuBej6NaAVOKW7GXiOJAq2WrileGKfMc9kIny20zW3uWkRLm-O-3Yzze1zFpxmqvsvCxZ5ERVZ6leiNXSu3tez71ZZwp0O9gys4knjrI-9w46l_vFuRtjL6XEeFfHEZFaNJpz-lcnb3w0okrbM',
                q: '3I1qeEDslZFB8iNfpKAdWtz_Wzm6-jayT_V6aIvhvMj5mnU-Xpj75zLPQSGa9wunMlOoZW9w1wDO1FVuDhwzeOJaTm-Ds0MezeC4U6nVGyyDHb4CUA3ml2tzt4yLrqGYMT7XbADSvuWYADHw79OFjEi4T3s3tJymhaBvy1ulv8M',
                qi: 'wSbXte9PcPtr788e713KHQ4waE26CzoXx-JNOgN0iqJMN6C4_XJEX-cSvCZDf4rh7xpXN6SGLVd5ibIyDJi7bbi5EQ5AXjazPbLBjRthcGXsIuZ3AtQyR0CEWNSdM7EyM5TRdyZQ9kftfz9nI03guW3iKKASETqX2vh0Z8XRjyU',
                use: 'sig',
            }, {
                crv: 'P-256',
                d: 'K9xfPv773dZR22TVUB80xouzdF7qCg5cWjPjkHyv7Ws',
                kty: 'EC',
                use: 'sig',
                x: 'FWZ9rSkLt6Dx9E3pxLybhdM6xgR5obGsj5_pqmnz5J4',
                y: '_n8G69C-A2Xl4xUW2lF0i8ZGZnk_KPYrhv4GbTGu5G4',
            },
        ],
    },
    loadExistingGrant: async (ctx) => {
        // https://github.com/panva/node-oidc-provider/blob/main/recipes/skip_consent.md
        const grantId = (ctx.oidc.result
            && ctx.oidc.result.consent
            && ctx.oidc.result.consent.grantId) || ctx.oidc.session.grantIdFor(ctx.oidc.client.clientId);

        if (grantId) {
            return ctx.oidc.provider.Grant.find(grantId);
        } else {
            const grant = new ctx.oidc.provider.Grant({
                clientId: ctx.oidc.client.clientId,
                accountId: ctx.oidc.session.accountId,
            });

            grant.addOIDCScope('openid email profile offline_access');
            grant.addOIDCClaims(['first_name refresh_token']);
            grant.addResourceScope('urn:example:resource-indicator', 'api:read api:write');
            await grant.save();
            return grant;
        }
    },
    issueRefreshToken: async (ctx, client, code) => {
        if (!client.grantTypeAllowed('refresh_token')) {
            return false;
        }
        return code.scopes.has('offline_access') || (client.applicationType === 'web' && client.tokenEndpointAuthMethod === 'none');
    },
    ttl: {
        AuthorizationCode: 30 /* 30 seconds */,
        Session: 1209600 /* 14 days in seconds */,
        DeviceCode: 600 /* 10 minutes in seconds */,
        Grant: 1209600 /* 14 days in seconds */,
        IdToken: 10 /* 1 hour in seconds */,
        Interaction: 3600 /* 1 hour in seconds */,
        AccessToken: 10  /* 30 minutes in seconds */,
    }
}
module.exports = config;
