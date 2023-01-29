"use client";
import { del, get, set, update } from "idb-keyval";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { ulid } from "ulid";
import { Quest } from "../../generated/graphql";
import { workspaceQuestAndSolutionList } from "../../serverFunctions/workplaceQuestAndSolutionList";
import { QuestAndSolutionList, QuestVersions } from "../../utilities/types";
import { USER_ID } from "../../utilities/userId";
import { WorkspaceStore } from "../../zustand/workspace";
import { createQuest } from "./Actions";
import styles from "./workspace.module.css";
const fetchQuestAndSolutionList = ({
  serverVersion,
  setQuests,
}: {
  serverVersion: number;
  setQuests: (args: Quest[]) => void;
}) => {
  try {
    const listVersion = JSON.parse(localStorage.getItem(`LIST#${USER_ID}`)!) as
      | number
      | null;

    // console.log(window.getSelection());
    console.log(listVersion);
    if (!listVersion || listVersion < serverVersion) {
      console.log("requesting list from the server");
      // const serverQuestAndSolutionList = use(
      //   workspaceQuestAndSolutionList({ userId: USER_ID })
      // ) as Quest[];

      const serverQuestAndSolutionList: Quest[] = [
        {
          id: "46b01817-4754-423c-bcf1-da3e761542bd",
          title: "Nothing",
          topic: "marketing",
          inTrash: false,

          version: 1,
        },
        {
          id: "01GMAX4H0W29E22N1KT89R41GS",
          title: "Kekekeke",
          topic: "marketing",
          inTrash: false,
          version: 1,
        },
      ];
      // let quests = [];
      let lastQuestIndex: number | undefined;

      if (serverQuestAndSolutionList) {
        const filteredList = serverQuestAndSolutionList.filter(
          (q) => q.inTrash === false
        );
        // for (let i = 0; i < serverQuestAndSolutionList.length; i++) {
        //   if (serverQuestAndSolutionList[i].SK?.startsWith("#QUEST")) {
        //     if (!serverQuestAndSolutionList[i].inTrash) {
        //       quests.push(serverQuestAndSolutionList[i]);
        //     }
        //   } else {
        //     lastQuestIndex = i;
        //     break;
        //   }
        // }
        // console.log("quests from server", quests);

        // setQuests(quests);
        setQuests(filteredList);
        filteredList.forEach((q) => {
          const questVersions = JSON.parse(
            localStorage.getItem(q.id)!
          ) as QuestVersions | null;
          if (questVersions) {
            const updatedQuestVersions: QuestVersions = {
              server: q.version!,
              local: questVersions.local,
            };

            localStorage.setItem(q.id, JSON.stringify(updatedQuestVersions));
          }
        });
        set(`LIST#${USER_ID}`, {
          id: `LIST#${USER_ID}`,
          list: serverQuestAndSolutionList,
        }).then(() => {
          localStorage.setItem(
            `LIST#${USER_ID}`,
            JSON.stringify(serverVersion)
          );
          console.log("local list updated!");
        });
      }
    } else {
      console.log("list is fresh");
      get(`LIST#${USER_ID}`).then((list: QuestAndSolutionList) => {
        if (list) {
          const filteredList = list.list.filter((q) => q.inTrash === false);
          setQuests(filteredList);
        }
      });
    }
  } catch (error) {
    console.log(`Failed ${error}`);
  }
};
const List = ({ serverVersion }: { serverVersion: number }) => {
  const router = useRouter();
  const quests = WorkspaceStore((state) => state.quests);
  // const quests = use(
  //   workspaceQuestAndSolutionList({ userId: USER_ID, serverVersion })
  // );
  const setQuests = WorkspaceStore((state) => state.setQuests);
  const addQuest = WorkspaceStore((state) => state.addNewQuest);
  const _deleteQuest = WorkspaceStore((state) => state.deleteQuest);
  const [deletedQuests, setDeletedQuests] = useState<Quest[]>();

  const fetchDeletedList = useCallback(() => {
    get(`LIST#${USER_ID}`).then((list: QuestAndSolutionList) => {
      if (list) {
        const filteredList = list.list.filter((q) => q.inTrash === true);
        setDeletedQuests(filteredList);
      }
    });
  }, []);
  const deleteQuest = ({ questId }: { questId: string }) => {
    const listVersion =
      JSON.parse(localStorage.getItem(`LIST#${USER_ID}`)!) + 1;
    localStorage.setItem(`LIST#${USER_ID}`, listVersion);

    get(questId).then((quest: Quest) => {
      // console.log("quest checkign", quest);
      // console.log(
      //   "true or false",
      //   quest.title !== "" || quest.description !== ""
      // );
      if (quest && (quest.title !== "" || quest.description !== "")) {
        console.log("saving...");
        update(`LIST#${USER_ID}`, (list: QuestAndSolutionList) => {
          list.list.forEach((q) => {
            if (q.id === questId) {
              q.inTrash = true;
            }
          });

          return list;
        });
      } else {
        console.log("not saving");
        update(`LIST#${USER_ID}`, (list: QuestAndSolutionList) => {
          const newList = list.list.filter((q) => q.id !== questId);
          list.list = newList;

          return list;
        });
      }
      del(questId);

      localStorage.removeItem(questId);
    });
    _deleteQuest({ questId: questId });
  };
  const deletePermanently = ({ questId }: { questId: string }) => {
    update(`LIST#${USER_ID}`, (list: QuestAndSolutionList) => {
      const newList = list.list.filter((q) => q.id !== questId);
      list.list = newList;
      setDeletedQuests(newList);

      return list;
    });
  };
  const restoreQuest = ({ questId }: { questId: string }) => {
    //fetch the quest from the server and push it to the list.
  };
  console.log("quests from the list", quests);

  useEffect(() => {
    fetchQuestAndSolutionList({ serverVersion, setQuests });
  }, []);
  if (!quests) {
    return <div>No data</div>;
  }
  return (
    <>
      <div className={styles.questAndSolutionList} id="list">
        <div className={styles.settingsContainer}>
          <div className={styles.search}> Search</div>
        </div>
        <div className={styles.questToggleContainer}>
          <div>
            <h3>Quests</h3>
          </div>
        </div>
        {!quests ? (
          <div>No Data</div>
        ) : (
          quests.map((q) => (
            <div className={styles.questComponent} key={q!.id}>
              <Link href={`/workspace/quests/${q!.id}`}>
                <div className="flex">
                  <div className={styles.topicIcon}>
                    <h1 className={styles.topicIconSymbol}>
                      {!q.topic ? "" : q.topic[0]}
                    </h1>
                  </div>
                  <div className={styles.questComponentTitle}>
                    {!q.title ? "Untitled" : q!.title}
                  </div>
                </div>
              </Link>

              <button
                className={styles.deleteQuestButton}
                onClick={() => deleteQuest({ questId: q.id })}
              >
                X
              </button>
            </div>
          ))
        )}
        <button
          className={styles.addQuestContainer}
          onClick={async () => {
            const id = ulid();
            addQuest({ questId: id });
            const result = await createQuest({ id });
            if (result) {
              router.push(`/workspace/quests/${id}`);
            }
          }}
        >
          <div className={styles.addQuestIcon}>
            <h2>+</h2>
          </div>
        </button>
        <button
          className={styles.trashContainer}
          onClick={() => fetchDeletedList()}
        >
          trash
        </button>
        {!deletedQuests ? (
          <div></div>
        ) : (
          deletedQuests.map((q) => (
            <div className={styles.questComponent} key={q!.id}>
              <Link href={`/workspace/quests/${q!.id}`}>
                <div className="flex">
                  <div className={styles.topicIcon}>
                    <h1 className={styles.topicIconSymbol}>
                      {!q.topic ? "" : q.topic[0]}
                    </h1>
                  </div>
                  <div className={styles.questComponentTitle}>
                    {!q.title ? "Untitled" : q!.title}
                  </div>
                </div>
              </Link>

              <button
                className={styles.deleteQuestButton}
                onClick={() => deletePermanently({ questId: q.id })}
              >
                X
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};
export default List;
// export default withUrqlClient((ssr) => ({
//   url: serverUrl,
// }))(QuestAndSolutionsList);
