import { get, set } from "idb-keyval";
import { cache } from "react";
import { Quest } from "../generated/graphql";
import { serverUrl } from "../utilities/constants";
import { QuestAndSolutionList, QuestVersions } from "../utilities/types";
import { USER_ID } from "../utilities/userId";
export const workspaceQuestAndSolutionList = cache(
  async ({
    userId,
    serverVersion,
  }: {
    userId: string;
    serverVersion: number;
  }) => {
    // try {
    //   const listVersion = JSON.parse(
    //     localStorage.getItem(`LIST#${USER_ID}`)!
    //   ) as number | null;

    //   // console.log(window.getSelection());
    //   console.log(listVersion);
    //   if (!listVersion || listVersion !== serverVersion) {
    //     console.log("requesting list from the server");
    //     // const serverQuestAndSolutionList = use(
    //     //   workspaceQuestAndSolutionList({ userId: USER_ID })
    //     // ) as Quest[];

    //     const serverQuestAndSolutionList: Quest[] = [
    //       {
    //         id: "46b01817-4754-423c-bcf1-da3e761542bd",
    //         title: "Nothing",
    //         topic: "marketing",
    //         inTrash: false,

    //         version: 1,
    //       },
    //       {
    //         id: "01GMAX4H0W29E22N1KT89R41GS",
    //         title: "Kekekeke",
    //         topic: "marketing",
    //         inTrash: false,
    //         version: 1,
    //       },
    //     ];
    //     // let quests = [];
    //     let lastQuestIndex: number | undefined;

    //     if (serverQuestAndSolutionList) {
    //       // for (let i = 0; i < serverQuestAndSolutionList.length; i++) {
    //       //   if (serverQuestAndSolutionList[i].SK?.startsWith("#QUEST")) {
    //       //     if (!serverQuestAndSolutionList[i].inTrash) {
    //       //       quests.push(serverQuestAndSolutionList[i]);
    //       //     }
    //       //   } else {
    //       //     lastQuestIndex = i;
    //       //     break;
    //       //   }
    //       // }
    //       // console.log("quests from server", quests);

    //       // setQuests(quests);
    //       // setQuests(serverQuestAndSolutionList);

    //       serverQuestAndSolutionList.forEach((q) => {
    //         const questVersions = JSON.parse(
    //           localStorage.getItem(q.id)!
    //         ) as QuestVersions | null;
    //         if (questVersions) {
    //           const updatedQuestVersions: QuestVersions = {
    //             server: q.version!,
    //             local: questVersions.local,
    //           };

    //           localStorage.setItem(q.id, JSON.stringify(updatedQuestVersions));
    //         }
    //       });
    //       set(`LIST#${USER_ID}`, {
    //         id: `LIST#${USER_ID}`,
    //         list: serverQuestAndSolutionList,
    //       }).then(() => {
    //         localStorage.setItem(
    //           `LIST#${USER_ID}`,
    //           JSON.stringify(serverVersion)
    //         );
    //         console.log("local list updated!");
    //       });
    //     }
    //     return serverQuestAndSolutionList;
    //   } else {
    //     console.log("list is fresh");
    //     get(`LIST#${USER_ID}`).then((list: QuestAndSolutionList) => {
    //       if (list) {
    //         const filteredList = list.list.filter((q) => q.inTrash === false);
    //         // setQuests(filteredList);
    //         return filteredList;
    //       }
    //     });
    //   }
    // } catch (error) {
    //   console.log(`Failed ${error}`);
    // }
    const res = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
    query workspaceQuestAndSolutionList($userId: String!) {
      workspaceQuestAndSolutionList(userId: $userId) {
        id
        title
        topic
        inTrash
        version
      }
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
    return json.data.workspaceQuestAndSolutionList;
  }
);
