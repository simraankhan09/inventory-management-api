import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema";

export const server = new ApolloServer({
  typeDefs,
});
