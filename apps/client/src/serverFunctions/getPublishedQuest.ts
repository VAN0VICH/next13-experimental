import "server-only";
import { serverUrl } from "../utilities/constants";
export const getPublishedQuestById = async (id: string) => {
  const res = await fetch(serverUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query PublishedQuest($id: String!) {
  publishedQuest(id: $id) {
        id
        title
        topic
        description
        subtopic
        reward
        slots
        creatorId
  }
}
`,
      variables: { id },
    }),
  });

  const json = await res.json();

  if (json.errors) {
    const { message } = json.errors[0] || {};
    throw new Error(message || "Error…");
  }

  return json.data.publishedQuest;
};
