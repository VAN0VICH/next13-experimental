import styles from "../../../components/Workspace/workspace.module.css";

import React from "react";

import List from "../../../components/Workspace/List";
import { workspaceQuestAndSolutionListVersion } from "../../../serverFunctions/workplaceQuestAndSolutionListVersion";
import { USER_ID } from "../../../utilities/userId";

const WorkspaceLayout = async ({ children }: { children: React.ReactNode }) => {
  // const version = (await workspaceQuestAndSolutionListVersion(
  //   USER_ID
  // )) as number;
  const version = 1;
  console.log("version", version);
  return (
    <div className={styles.parent}>
      <div className={styles.questAndSolutionListContainer}>
        <List serverVersion={version} />
      </div>
      <div className={styles.workspaceContainer}>{children}</div>
    </div>
  );
};

export default WorkspaceLayout;
