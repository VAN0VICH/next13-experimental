import "server-only"
export const getUserById = async (id: string) => {
  const res = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query GetUserById($id: String!) {
  getUserById(id: $id) {
    id
    username
    level
    experience

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

  return json.data.getUserById;
};

