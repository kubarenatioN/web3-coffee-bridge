import { GraphQLClient } from 'graphql-request';

export const client = new GraphQLClient(import.meta.env.VITE_GRAPH_URL);
