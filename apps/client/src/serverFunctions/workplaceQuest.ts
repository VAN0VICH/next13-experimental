import { cache } from "react";
import { serverUrl } from "../utilities/constants";
export const workspaceQuest = cache(
  async ({ questId, userId }: { questId: string; userId: string }) => {
    const res = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
query WorkspaceQuest($questId: String!, $userId: String!) {
  workspaceQuest(questId: $questId, userId: $userId) {
  id
  title
  topic
  subtopic
  reward
  slots
  description
  createdAt
  }
  }



`,
        variables: { questId, userId },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] || {};
      throw new Error(message || "Error…");
    }

    return json.data.workspaceQuest;
  }
);
