"use client";
import { withUrqlClient } from "next-urql";
import {
  cacheExchange,
  dedupExchange,
  fetchExchange,
  ssrExchange,
  subscriptionExchange,
} from "urql";
import {
  Quest,
  useQuestCreatedSubscription,
} from "../../../../generated/graphql";
import { wsClient } from "../../../../utilities/urqlClient";
import styles from "./notifications.module.css";

const handleSubscription = (
  messages: Quest[] = [],
  response: { newMessages: Quest[] }
) => {
  return [response.newMessages, ...messages];
};
const Notifications = () => {
  const [res] = useQuestCreatedSubscription(
    { variables: { publisherId: "dwafawfwdwd" } },
    handleSubscription
  );
  if (!res.data) {
    return <p>No new messages</p>;
  }

  return (
    <div className={styles.parent}>
      <div className={styles.parentContent}>
        <div className={styles.notificationsContainer}>
          {res.data.map((message) => (
            <div key={message.id} className={styles.notification}>
              yo
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default withUrqlClient(
  (ssrExchange) => ({
    url: "http://localhost:4000/graphql",
    exchanges: [
      dedupExchange,
      cacheExchange,
      subscriptionExchange({
        forwardSubscription: (operation) => ({
          subscribe: (sink) => ({
            unsubscribe: wsClient.subscribe(operation, sink),
          }),
        }),
      }),
      ssrExchange,
      fetchExchange,
    ],
  }),
  { ssr: false }
)(Notifications);
