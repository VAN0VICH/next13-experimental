import "server-only";
export const getTestQuestById = async (id: string) => {
  const res = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: ` query TestQuest($id: String!) {
  testQuest(id: $id) {
        id
        title
        topic
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

  return json.data.testQuest;
};
