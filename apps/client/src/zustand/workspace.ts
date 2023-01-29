import create from "zustand";
import Quests from "../components/HomePage/HomePage";
import produce from "immer";
import {
  Exact,
  InputMaybe,
  Quest,
  UpdateQuestTransaction,
} from "../generated/graphql";
import { TransactionState } from "../utilities/types";

export interface Solution {
  _id: string;
}

interface WorkspaceState {
  questTransactionStore: TransactionState;
  addQuestTransaction: (props: {
    questId: string;
    attribute: string;
    text?: string;
    number?: number;
  }) => void;
  clearQuestTransactionStore: () => void;
  currentQuest: Quest | null;
  setCurrentQuest: (quest: Quest) => void;
  quests: Quest[];
  solutions: Solution[];
  addNewQuest: ({ questId }: { questId: string }) => void;
  deleteQuest: ({ questId }: { questId: string }) => void;
  setQuests: (args: Quest[]) => void;
  setSolutions: (args: Solution[]) => void;
  setQuestAttribute: (props: {
    questId: string;
    attribute: string;
    value: string;
  }) => void;
}

export const WorkspaceStore = create<WorkspaceState>((set, get) => ({
  solutions: [],
  // quests: [],
  currentQuest: null,
  setCurrentQuest: (quest) => set({ currentQuest: quest }),

  quests: [],
  questTransactionStore: [],
  addQuestTransaction: (props) => {
    const { questId, attribute, text, number } = props;
    set(
      produce((state: WorkspaceState) => {
        const transactionIndex = state.questTransactionStore.findIndex(
          (t) => t.questId === questId && t.attribute === attribute
        );
        if (transactionIndex < 0) {
          const newTransaction = props;
          state.questTransactionStore.push(newTransaction);
        } else {
          if (
            attribute === "title" ||
            attribute === "topic" ||
            attribute === "subtopic"
          ) {
            state.questTransactionStore[transactionIndex].text = text;
          } else {
            state.questTransactionStore[transactionIndex].number = number;
          }
        }
      })
    );
  },
  clearQuestTransactionStore: () => set({ questTransactionStore: [] }),
  addNewQuest: ({ questId }) => {
    const quest: Quest = {
      id: questId,
      title: "",
      topic: "",
      subtopic: "",
      reward: 0,
      slots: 0,
      published: false,
      inTrash: false,
      version: 1,
    };
    // set({ currentQuest: quest });
    set(
      produce((state: WorkspaceState) => {
        state.quests.push(quest);
      })
    );
  },

  deleteQuest: ({ questId }) => {
    let quests = get().quests;
    const filteredQuests = quests.filter((q) => q.id !== questId);
    set({ quests: filteredQuests });
    // set(
    //   produce((state: WorkspaceState) => {
    //     state.quests = filteredQuests;
    //   })
    // );
  },

  setQuests: (quests) => {
    set({ quests });
  },

  setQuestAttribute: ({ questId, attribute, value }) =>
    set(
      produce((state: WorkspaceState) => {
        const index = state.quests.findIndex((q) => q.id === questId);
        if (attribute === "title") {
          state.quests[index].title = value;
        } else if (attribute === "topic") {
          state.quests[index].topic = value;
        } else {
          state.quests[index].subtopic = value;
        }
      })
    ),

  setSolutions: (solutions) => set({ solutions }),
}));
