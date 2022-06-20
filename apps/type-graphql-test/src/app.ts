/* eslint-disable import/no-named-as-default-member */
import {ApolloServer} from 'apollo-server-express'
import {ContextFunction} from 'apollo-server-core'
import express, {Express} from 'express'
import {AuthChecker, buildSchema, PrintSchemaOptions} from 'type-graphql'
import {Container} from 'typedi'

export interface EmitSchemaFileOptions extends Partial<PrintSchemaOptions> {
  path?: string
}

export type App = Express

export interface CreateAppOptions<Context> {
  authChecker?: AuthChecker<Context>
  context?: ContextFunction
  emitSchemaFile?: string | boolean | EmitSchemaFileOptions
  resolvers?: NonEmptyArray<AnyClass> | NonEmptyArray<string>
}

export const createApp = async <Context>(
  options: CreateAppOptions<Context>,
) => {
  const {authChecker, resolvers, context} = options
  const app = express()

  app.use(express.json())

  const schema = await buildSchema({
    authChecker,
    container: Container,
    emitSchemaFile: false,
    resolvers,
  })

  const apolloServer = new ApolloServer({
    /**
     * @see https://www.apollographql.com/docs/apollo-server/performance/cache-backends/
     */
    cache: 'bounded',
    context,
    introspection: true,
    schema,
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({app})

  return app
}
