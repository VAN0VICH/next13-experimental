"use client";
import { Quest, useCreateQuestMutation } from "../../../generated/graphql";
import styles from "./workspace.module.css";

import { v4 as uuidv4 } from "uuid";
import { USER_ID } from "../../../utilities/userId";
import { useRouter } from "next/navigation";
import { serverUrl } from "../../../utilities/constants";
import { withUrqlClient } from "next-urql";
import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { set, update } from "idb-keyval";
import { QuestAndSolutionList } from "../../../utilities/types";
import { ulid } from "ulid";
import { WorkspaceStore } from "../../../zustand/workspace";
export const createQuest = async ({ id }: { id: string }) => {
  const versions = { server: 1, local: 1 };
  localStorage.setItem(id, JSON.stringify(versions));
  let listVersion =
    (JSON.parse(localStorage.getItem(`LIST#${USER_ID}`)!) as number) + 1;
  localStorage.setItem(`LIST#${USER_ID}`, JSON.stringify(listVersion));
  const newQuest: Quest = {
    id,
    title: "",
    topic: "",
    subtopic: "",
    published: false,
    description: "",
    inTrash: false,
    slots: 0,
    reward: 0,
    version: 1,
  };
  update(`LIST#${USER_ID}`, (list: QuestAndSolutionList) => {
    list.list.push(newQuest);
    return list;
  });
  set(id, newQuest);
  return true;
};
const ActionComponent = () => {
  const router = useRouter();
  const [result, createServerQuest] = useCreateQuestMutation();
  const addQuest = WorkspaceStore((state) => state.addNewQuest);
  return (
    <div className={styles.actionButtonsContainer}>
      <div>
        <button
          className={styles.actionButton}
          onClick={async () => {
            const id = ulid();
            addQuest({ questId: id });

            const result = await createQuest({ id });
            if (result) {
              router.push(`/workspace/quests/${id}`);
            } else {
              console.log("something went wrong");
            }
          }}
        >
          Create Quest
        </button>
        <button className={styles.actionButton}>Create solution</button>
      </div>
    </div>
  );
};
export default withUrqlClient((ssr) => ({
  url: serverUrl,
  exchanges: [
    dedupExchange,
    cacheExchange({
      optimistic: {
        createQuest(args, cache, info) {
          return {
            __typename: "Quest",
            id: args.id,
            creatorId: args.creatorId,
            title: "",
            topic: "",
            subtopic: "",
            reward: 0,
            slots: 0,
          };
        },
      },
    }),
    fetchExchange,
  ],
}))(ActionComponent);
