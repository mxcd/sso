const path = require('path');
const { ApolloServer } =  require('apollo-server-express');
// import cors from 'cors';
// const helmet = require('helmet');
import compression from 'compression';
const { Provider } =  require('oidc-provider');
const providerConfig = require('../provider-config')

const fs = require('fs');
const http = require('http');
const https = require('https');

const routes = require('./routes');

import {prisma, log, env, contextBuilder} from "./util";

let express = require("express");

const {API_PORT = 3000, ISSUER_URL = "https://localhost:3000"} = env

import schema from './schema/schemas';

async function main() {
    log.info(`Generating express server`)
    const app = express();
    // app.use(helmet());
    // app.set('view engine', 'pug')
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    const oidc = new Provider(ISSUER_URL, {
        ...providerConfig,
        async findAccount(ctx, id) {
            console.log(`getting account id '${id}'`)
            console.dir(ctx)
            return {
                accountId: id,
                async claims(use, scope) {
                    console.log(`getting claims`)
                    console.dir(use)
                    console.dir(scope)
                    return { sub: id };
                },
            };
        }
    });


    log.info(`Generating Apollo server`)
    const index = new ApolloServer({
        schema: schema,
        context: contextBuilder
    });

    log.info(`Applying middlewares`)
    // app.use('*', cors());
    app.use(compression());
    index.applyMiddleware({ app, path: '/graphql' });

    routes(app, oidc);
    app.use(oidc.callback());

    if(!env.production) {
        const privateKey  = fs.readFileSync('localhost+1-key.pem', 'utf8');
        const certificate = fs.readFileSync('localhost+1.pem', 'utf8');
        const credentials = {key: privateKey, cert: certificate};
        const server = https.createServer(credentials, app);
        log.info(`Starting server`)
        server.listen({ port: API_PORT }, (): void => console.log(`Server is now running on port ${API_PORT}`));
    }
    else {
        const server = http.createServer(app);
        log.info(`Starting server`)
        server.listen({ port: API_PORT }, (): void => console.log(`Server is now running on port ${API_PORT}`));
    }
}

main()
.catch(e => {
    throw e;
})
.finally(async () => {
    await prisma.$disconnect()
})
