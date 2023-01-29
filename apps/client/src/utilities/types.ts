import { Quest, UpdateQuestTransaction } from "../generated/graphql";

export type WorkspaceQuestResponse = {
  quests: Quest[];
  message: string;
};

export type QuestAndSolutionList = {
  id: string;
  list: Quest[];
};
export type QuestVersions = {
  server: number;
  local: number;
};

export type TransactionState = UpdateQuestTransaction[];
