import 'graphql-import-node';
import resolvers from '../controller/resolvers';
import {buildFederatedSchema} from "@apollo/federation";
import * as fs from "fs";
const { mergeTypeDefs } = require('@graphql-tools/merge');
import { gql } from 'apollo-server-express';
import path from "path";

const types = gql(fs.readFileSync(path.join(__dirname, 'types.graphql'), 'utf8'))
const inputs = gql(fs.readFileSync(path.join(__dirname, 'inputs.graphql'), 'utf8'))
const operations = gql(fs.readFileSync(path.join(__dirname, 'operation.graphql'), 'utf8'))

let typeDefs = mergeTypeDefs([types, inputs, operations]);

//@ts-ignore
const schema = buildFederatedSchema([{ typeDefs, resolvers }]);
export default schema;