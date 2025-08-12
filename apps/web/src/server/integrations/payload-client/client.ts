import 'server-only';
import {
  ApolloClient,
  type DefaultOptions,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

//TODO: JF - put in a proper caching layer
const defaultOptions: DefaultOptions = {
  watchQuery: { fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache' },
  query: { fetchPolicy: 'no-cache' },
};

const createApolloClient = (): ApolloClient<unknown> =>
  new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.PAYLOAD_URL,
      fetch: (uri, options) =>
        fetch(uri, {
          ...options,
          cache: 'no-store',
          next: { revalidate: 0 },
        }),
    }),
    defaultOptions,
  });

export default createApolloClient;
