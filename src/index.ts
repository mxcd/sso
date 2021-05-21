const { ApolloServer } =  require('apollo-server-express');
import { createServer } from 'http';
import compression from 'compression';
// import cors from 'cors';
const helmet = require('helmet');
const { Provider } =  require('oidc-provider');
const providerConfig = require('../provider-config')

import {prisma, log, env, contextBuilder} from "./util";

let express = require("express");
if(!env.production) {
    require("https-localhost");
}

const {API_PORT = 3000, ISSUER_URL = "https://localhost:3000"} = env

import schema from './schema/schemas';

async function main() {
    log.info(`Generating express server`)
    const app = express();
    app.use(helmet());
    app.set('view engine', 'pug')
    app.set('views', './views')

    const oidc = new Provider(ISSUER_URL, {
        ...providerConfig,
        async findAccount(ctx, id) {
            return {
                accountId: id,
                async claims(use, scope) { return { sub: id }; },
            };
        }
    });

    app.use(oidc.callback());

    log.info(`Generating Apollo server`)
    const index = new ApolloServer({
        schema: schema,
        context: contextBuilder
    });

    log.info(`Applying middlewares`)
    // app.use('*', cors());
    app.use(compression());
    index.applyMiddleware({ app, path: '/graphql' });

    log.info(`Creating server`)
    const httpServer = createServer(app);

    log.info(`Starting server`)
    httpServer.listen({ port: API_PORT }, (): void => console.log(`GraphQL is now running on port ${API_PORT}`));
}

main()
.catch(e => {
    throw e;
})
.finally(async () => {
    await prisma.$disconnect()
})
