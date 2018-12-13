import resolvers from './resolvers/index';
import typeDefs from './schemas/index';
import classes from './schemas/classes/index';
import { makeExecutableSchema } from 'graphql-tools'

export const OpenEndpoint = makeExecutableSchema({
  typeDefs,
  resolvers
})

export const OpenEndpointClasses = classes;
