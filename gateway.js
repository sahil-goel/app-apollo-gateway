const {ApolloServer} = require('apollo-server');
const {ApolloGateway,RemoteGraphQLDataSource} = require('@apollo/gateway');
const { readFileSync } = require('fs');
const { ApolloServerPluginUsageReporting } = require('apollo-server-core');
const { getServiceList } = require("./servicelist");
require('dotenv').config();

const port = process.env.APOLLO_PORT || 4000;
const serverInDebugMode = process.env.APOLLO_SERVER_IN_DEBUG == "true" ? true : false;
const schemaBuiltUsingRover = process.env.APOLLO_SCHEMA_STRATEGY == "ROVER" ? true : false;
const schemaBuiltUsingStudio = process.env.APOLLO_SCHEMA_STRATEGY == "STUDIO" ? true : false;
const schemaBuiltUsingServiceList = process.env.APOLLO_SCHEMA_STRATEGY == "SERVICE_LIST" ? true : false;

const config = {};
const plugins = [];

if (schemaBuiltUsingRover) {
  const supergraph = "supergraph.graphql"
  config['supergraphSdl'] = readFileSync(supergraph).toString();
  console.log('Starting Apollo Gateway in local mode ...');
  console.log(`Using local: ${supergraph}`)
} else if (schemaBuiltUsingStudio) {
  console.log('Starting Apollo Gateway in managed mode ...');
  if ((process.env.APOLLO_KEY === undefined) || (process.env.APOLLO_KEY  === null) ||
          (process.env.APOLLO_GRAPH_REF === undefined) || (process.env.APOLLO_GRAPH_REF  === null)) {
        throw ("Required environment variables Apollo Key and Graph Ref missing" );
  }
  plugins.push(ApolloServerPluginUsageReporting({fieldLevelInstrumentation: 0.01}));
} else {
    config['serviceList'] = getServiceList()
}
config['buildService'] =  ({
  name,
  url
}) => {
  return new RemoteGraphQLDataSource({
      url: url,
      willSendRequest: ({
          request,
          context
      }) => {
          if (context.req && context.req.headers['x-channel']) {
              request.http.headers.set('x-channel', context.req.headers['x-channel']);
          }
          if (context.req && context.req.headers['traceparent']) {
              request.http.headers.set('traceparent', context.req.headers['traceparent']);
          }
          if (context.req && context.req.headers['x-b3-traceid']) {
                request.http.headers.set('x-b3-traceid', context.req.headers['x-b3-traceid']);
          }
          if (context.req && context.req.headers['x-b3-parentspanid']) {
                request.http.headers.set('x-b3-parentspanid', context.req.headers['x-b3-parentspanid']);
          }
          if (context.req && context.req.headers['x-b3-spanid']) {
                request.http.headers.set('x-b3-spanid', context.req.headers['x-b3-spanid']);
          }
          if (context.req && context.req.headers['x-b3-sampled']) {
                request.http.headers.set('x-b3-sampled', context.req.headers['x-b3-sampled']);
          }
          if (context.req && context.req.headers['x-2fa-id']) {
              request.http.headers.set('x-2fa-id', context.req.headers['x-2fa-id']);
          }
          if (context.customHeaders && context.customHeaders.headers.authorization) {
              request.http.headers.set('Authorization', context.customHeaders.headers.authorization);
          }
          if (context.req && context.req.headers['x-session-id']) {
              request.http.headers.set('x-session-id', context.req.headers['x-session-id']);
          }
          if (context.req && context.req.headers['x-2fa-device-session-id']) {
              request.http.headers.set('x-2fa-device-session-id', context.req.headers['x-2fa-device-session-id']);
          }
          if (context.req && context.req.headers['x-2fa-device-transaction-id']) {
              request.http.headers.set('x-2fa-device-transaction-id', context.req.headers['x-2fa-device-transaction-id']);
          }
          if (context.req && context.req.headers['x-device-id']) {
              request.http.headers.set('x-device-id', context.req.headers['x-device-id']);
          }
          if (context.req && context.req.headers['x-idempotency-key']) {
              request.http.headers.set('x-idempotency-key', context.req.headers['x-idempotency-key']);
          }
          return;
      }
  })
};

const gateway = new ApolloGateway(config);
const server = new ApolloServer({
  gateway,
  debug: serverInDebugMode,
  plugins,
  //building context to pass in custom headers defined above
  context: ({
    req
}) => {
    return {
        req,
        customHeaders: {
            headers: {
                ...req.headers,
            }
        }
    }
},
         // Apollo Graph Manager (previously known as Apollo Engine)
         // When enabled and an `ENGINE_API_KEY` is set in the environment,
         // provides metrics, schema management and trace reporting.
         engine: false,
         // Subscriptions are unsupported but planned for a future Gateway version.
         subscriptions: false,
         formatError(err) {
             if(process.env.NODE_ENV === 'production'){
                if (err.extensions.code.startsWith("GRAPHQL_VALIDATION_FAILED")) {
                  return new ApolloError('Its Invalid Schema!!!!','GRAPHQL_VALIDATION_FAILED');

                 }
             }
                 return err;
                 }
});

server
  .listen({port: port})
  .then(({url}) => {
    console.log(`🚀 Gateway ready at ${url}`);
  })
  .catch(err => {
    console.error(err);
  });
