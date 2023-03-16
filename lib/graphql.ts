import { GraphQLClient } from "graphql-request";

export const graphQLClient = new GraphQLClient(
    "https://query.graphqlana.com/",
    {
        headers: {
            authorization: `Bearer ${process.env.GRAPHQLANA_API_KEY}`,
        },
    }
);
