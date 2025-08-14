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

const PAYLOAD_GRAPHQL_URI_REGEX = /\/\/$/;

//TODO: JF Manage this with variable manager
const resolvePayloadGraphqlUri = (): string => {
  const explicit = process.env.PAYLOAD_URL?.trim();
  if (explicit) {
    return explicit;
  }

  const domain = process.env.VERCEL_URL || process.env.VERCEL_BRANCH_URL;
  if (domain) {
    return `https://${domain}/api/graphql`;
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (site) {
    return `${site.replace(PAYLOAD_GRAPHQL_URI_REGEX, '')}/api/graphql`;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000/api/graphql';
  }

  return 'http://localhost:3000/api/graphql';
};

const createApolloClient = (): ApolloClient<unknown> =>
  new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: resolvePayloadGraphqlUri(),
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
