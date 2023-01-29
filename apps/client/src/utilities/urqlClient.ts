import { SSRExchange } from "next-urql";
import { dedupExchange, fetchExchange, ssrExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { relayPagination } from "@urql/exchange-graphcache/extras";
import { buildSchema } from "graphql";
import { createClient as createWSClient } from "graphql-ws";
export const urqlClient = (ssr: SSRExchange) => {
  return {
    url: `http://localhost:4000/graphql`,

    exchanges: [
      dedupExchange,
      cacheExchange({
        resolvers: {
          Query: {
            publishedQuests: relayPagination(),
          },
        },
      }),
      // ssrExchange,
      fetchExchange,
    ],
  };
};

export const wsClient = createWSClient({
  url: "ws://localhost/graphql",
});
