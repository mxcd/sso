export default {
    clients: [
        {
            client_id: "oidc_test_id",
            client_secret: "oidc_test_secret",
            redirect_uris: ["http://localhost/secure/redirect_uri"]
        }
    ],
    cookies: {
        keys: ['idIXiSyBMZ9y15JilKDoFLV59MjhJKft'],
    },
    interactions: {
        url(ctx, interaction) {
            return `/interaction/${interaction.uid}`;
        },
    },
    features: {
        devInteractions: { enabled: false }, // defaults to true
        deviceFlow: { enabled: true }, // defaults to false
        revocation: { enabled: true }, // defaults to false
    },
}
