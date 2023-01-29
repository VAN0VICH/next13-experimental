import { cache } from "react";
import { serverUrl } from "../utilities/constants";
export const workspaceQuestAndSolutionListVersion =
  //  cache(
  async (userId: string) => {
    const res = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
query WorkspaceQuestAndSolutionListVersion($userId: String!) {
  workspaceQuestAndSolutionListVersion(userId: $userId)
}


`,
        variables: { userId },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] || {};
      throw new Error(message || "Error…");
    }

    return json.data.workspaceQuestAndSolutionListVersion;
  };
// );
