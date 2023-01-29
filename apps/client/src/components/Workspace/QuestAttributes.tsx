"use client";
import { cacheExchange } from "@urql/exchange-graphcache";
import { get, set, update } from "idb-keyval";
import debounce from "lodash.debounce";
import { withUrqlClient } from "next-urql";
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
import { dedupExchange, fetchExchange } from "urql";
import {
  Quest,
  UpdateQuestTransaction,
  useUpdateQuestAttributesMutation,
} from "../../generated/graphql";
import { workspaceQuest } from "../../serverFunctions/workplaceQuest";
import { serverUrl } from "../../utilities/constants";
import {
  QuestAndSolutionList,
  QuestVersions,
  TransactionState,
} from "../../utilities/types";
import { USER_ID } from "../../utilities/userId";
import { WorkspaceStore } from "../../zustand/workspace";
import styles from "./workspace.module.css";
import TiptapEditor from "./TiptapEditor";
const fetchQuest = ({
  questId,
  setQuest,
}: {
  questId: string;
  setQuest: (quest: Quest) => void;
}) => {
  try {
    const versions = JSON.parse(
      localStorage.getItem(questId)!
    ) as QuestVersions | null;

    if (!versions || versions.server !== versions.local) {
      console.log("requesting quest from the server");
      // const serverQuest = use(
      //   workspaceQuest({ questId, userId: USER_ID })
      // ) as Quest;
      const serverQuest: Quest = {
        id: questId,
        title: "Nothing",
        subtopic: "social media",
        topic: "marketing",
        description: "",
        inTrash: false,

        reward: 0,
        slots: 0,
        version: 1,
      };
      if (serverQuest) {
        console.log("updating the quest");
        setQuest(serverQuest);
        set(questId, serverQuest).then(() => {
          let versions: QuestVersions = {
            server: serverQuest.version,
            local: serverQuest.version,
          };
          localStorage.setItem(questId, JSON.stringify(versions));
          console.log("local quest updated!");
        });
      }
    } else {
      console.log("questIsFresh");
      get(questId).then((quest) => {
        if (quest) {
          setQuest(quest);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const QuestAttributes = ({ id }: { id: string }) => {
  // const [quest, setQuest] = useState<Quest>();
  const quest = WorkspaceStore((state) => state.currentQuest);
  const setCurrentQuest = WorkspaceStore((state) => state.setCurrentQuest);
  const setQuestAttribute = WorkspaceStore((state) => state.setQuestAttribute);
  const [, updateQuestAttributes] = useUpdateQuestAttributesMutation();
  const questTransactionsStore = WorkspaceStore(
    (state) => state.questTransactionStore
  );
  const addQuestTransaction = WorkspaceStore(
    (state) => state.addQuestTransaction
  );
  const clearQuestTransaction = WorkspaceStore(
    (state) => state.clearQuestTransactionStore
  );
  const updateQuest = useCallback(
    debounce(
      async ({
        questId,
        transactions,
        lastTransaction,
      }: {
        questId: string;
        transactions: TransactionState;
        lastTransaction: UpdateQuestTransaction;
      }) => {
        const { attribute, number, text } = lastTransaction;
        console.log("redacting quest attributes...", transactions);
        const _transactions = structuredClone(transactions);
        console.log("transactions at the beginnig", _transactions);
        const transactionIndex = transactions.findIndex(
          (t) => t.questId === questId && t.attribute === attribute
        );
        if (transactionIndex < 0) {
          const newTransaction = lastTransaction;

          _transactions.push(newTransaction);
        } else {
          if (
            attribute === "title" ||
            attribute === "topic" ||
            attribute === "subtopic"
          ) {
            _transactions[transactionIndex].text = text;
          } else {
            _transactions[transactionIndex].number = number;
          }
        }
        for (const item of _transactions) {
          // if(item.questId ===questId)

          if (item.attribute === "title") {
            console.log("redacting quest title");
            update(questId, (quest) => {
              quest.title = item.text;

              return quest;
            });
            update(`LIST#${USER_ID}`, (list: QuestAndSolutionList) => {
              list.list.forEach((q) => {
                if (q.id === questId) {
                  q.title = text;
                }
                return q;
              });
              return list;
            });
          } else if (item.attribute === "topic") {
            update(questId, (quest) => {
              quest.topic = item.text;
              return quest;
            });
            update(`LIST#${USER_ID}`, (list: QuestAndSolutionList) => {
              list.list.forEach((q) => {
                if (q.id === questId) {
                  q.topic = text;
                }
                return q;
              });

              return list;
            });
          } else if (item.attribute === "subtopic") {
            update(questId, (quest) => {
              quest.subtopic = item.text;
              return quest;
            });
          } else {
            update(questId, (quest) => {
              quest.reward = item.number;
              return quest;
            });
          }
        }
        update(questId, (quest) => {
          quest.version = quest.version + 1;
          return quest;
        });
        update(`LIST#${USER_ID}`, (list: QuestAndSolutionList) => {
          list.list.forEach((q) => {
            if (q.id === questId) {
              q.version = q.version + 1;
            }
            return q;
          });

          return list;
        });
        //updating the local quest versions after changes
        const versions = JSON.parse(
          localStorage.getItem(questId)!
        ) as QuestVersions;
        if (versions) {
          const newVersions = {
            server: versions.server + 1,
            local: versions.local + 1,
          };
          localStorage.setItem(questId, JSON.stringify(newVersions));
        }

        //updating the list quest version after changes
        const listVersion = JSON.parse(
          localStorage.getItem(`LIST#${USER_ID}`)!
        ) as number;
        if (listVersion) {
          const newVersion = listVersion + 1;

          localStorage.setItem(`LIST#${USER_ID}`, JSON.stringify(newVersion));
        }

        clearQuestTransaction();

        // console.log("update expression", UpdateExpression);
        // console.log("Expression Attribures", ExpressionAttributeValues);

        // const result = await updateQuestAttributes({
        //   updateQuestTransactions: _transactions,
        // });
        // if (result) {
        //   clearQuestTransaction();
        // } else {
        //   console.log("content was not saved...");
        // }
      },
      4000
    ),
    []
  );

  useEffect(() => {
    fetchQuest({ questId: id, setQuest: setCurrentQuest });
  }, []);

  console.log("transaction store", questTransactionsStore);

  if (!quest) {
    return <div>No data</div>;
  }
  return (
    <>
      <div>
        <div
          id="title"
          contentEditable="true"
          suppressContentEditableWarning={true}
          placeholder="Title"
          className={styles.titleContainer}
          onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Backspace") {
              console.log("backspace called");
              const title = document.getElementById("title");
              if (title?.childNodes[0].textContent === "") {
                e.preventDefault();
              }
            }
          }}
          onInput={(e) => {
            setQuestAttribute({
              questId: id,
              attribute: "title",
              value: e.currentTarget.textContent!,
            });
            addQuestTransaction({
              questId: id,
              attribute: "title",
              text: e.currentTarget.textContent!,
            });

            updateQuest({
              questId: id,
              transactions: questTransactionsStore,
              lastTransaction: {
                questId: id,
                attribute: "title",
                text: e.currentTarget.textContent!,
              },
            });
          }}
        >
          <h1 className={styles.title}>
            {!quest.title ? "Untitled" : quest.title}
          </h1>
        </div>
      </div>
      <div id="topic">
        <select
          className={styles.topicBadge}
          name="topics"
          id="topics"
          defaultValue={!quest!.topic ? "chooseTopic" : quest!.topic}
          onChange={(e) => {
            setQuestAttribute({
              questId: id,
              attribute: "topic",
              value: e.currentTarget.value!,
            });

            addQuestTransaction({
              questId: id,
              attribute: "topic",
              text: e.currentTarget.value!,
            });
            updateQuest({
              questId: id,

              transactions: questTransactionsStore,
              lastTransaction: {
                questId: quest.id!,
                attribute: "topic",
                text: e.currentTarget.value!,
              },
            });
          }}
        >
          <option value="chooseTopic">Choose topic...</option>
          <option value="marketing">Marketing</option>
          <option value="programming">Programming</option>
          <option value="art">Art</option>
          <option value="videography">Vidography</option>
        </select>
      </div>
      <div id="subtopic">
        <select
          className={styles.subtopicBadge}
          name="subtopics"
          id="subtopics"
          defaultValue={!quest!.subtopic ? "chooseSubtopic" : quest!.subtopic}
          onChange={(e) => {
            setQuestAttribute({
              questId: id,
              attribute: "subtopic",
              value: e.currentTarget.value!,
            });
            addQuestTransaction({
              questId: id,
              attribute: "subtopic",
              text: e.currentTarget.value!,
            });
            updateQuest({
              questId: id,

              transactions: questTransactionsStore,
              lastTransaction: {
                questId: id,
                attribute: "subtopic",
                text: e.currentTarget.value!,
              },
            });
          }}
        >
          <option value="chooseSubtopic">Choose subtopic...</option>
          <option value="programming">Programming</option>
          <option value="art">Art</option>
          <option value="videography">Vidography</option>
        </select>
      </div>
      <div id="reward" className="mt-2">
        <h1 className="font-medium">Reward </h1>
        <input
          type="number"
          onChange={(e) => {
            addQuestTransaction({
              questId: id,
              attribute: "reward",
              number: parseInt(e.currentTarget.value),
            });
            updateQuest({
              questId: id,

              transactions: questTransactionsStore,
              lastTransaction: {
                questId: id,
                attribute: "subtopic",
                text: e.currentTarget.value!,
              },
            });
          }}
        />
      </div>
      <TiptapEditor quest={quest} />
    </>
  );
};
export default withUrqlClient((ssr) => ({
  url: serverUrl,
  exchanges: [
    dedupExchange,
    cacheExchange({}),
    // ssrExchange,
    fetchExchange,
  ],
}))(QuestAttributes);
