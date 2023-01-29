// import ImagesPlugin from "../../../src/lexical/plugins/ImagesPlugin";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import styles from "../../../../../components/Workspace/workspace.module.css";
import QuestAttributes from "../../../../../components/Workspace/QuestAttributes";
import TiptapEditor from "../../../../../components/Workspace/TiptapEditor";

// import QuestAttributes from "./questAttributes";

const WorkspaceQuest = ({ params }: { params: { id: string } }) => {
  const id = params.id;

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editor}>
        <div className={styles.editorHeader}>
          <div className={styles.holeContainer}>
            <div className={styles.hole}></div>
          </div>
          <div className={styles.holeContainer}>
            <div className={styles.hole}></div>
          </div>
        </div>
        <div className={styles.padding}>
          <QuestAttributes pageProps={""} id={id} />
        </div>
      </div>
    </div>
  );
};
export default WorkspaceQuest;
// export default withUrqlClient((ssr) => ({
//   url: serverUrl,
//   exchanges: [
//     dedupExchange,
//     cacheExchange({}),
//     // ssrExchange,
//     fetchExchange,
//   ],
// }))(WorkspaceQuest);
