"use client";
import { useState } from "react";
import { InputMaybe, LastEvaluatedKey } from "../../generated/graphql";
import PublishedQuest from "./PublishedQuestComponent";
import styles from "./home.module.css";

const Questboard = () => {
  const [value, setValue] = useState("");
  const [pageVariables, setPageVariables] = useState<
    {
      after: InputMaybe<LastEvaluatedKey>;
    }[]
  >([
    {
      after: null,
    },
  ]);
  return (
    <div className={styles.questsContainer}>
      <div className="centerDiv">
        <input className={styles.searchBar}></input>
      </div>
      <div className={styles.refreshContainer}>
        <select className={styles.select}>
          <option className={styles.option}>Highest reward</option>
          <option>Newest</option>
        </select>
      </div>
      {pageVariables.map((variables, i) => {
        return (
          <PublishedQuest
            pageProps={""}
            key={"" + variables.after?.id}
            variables={variables}
            isLastPage={i === pageVariables.length - 1}
            onLoadMore={(after: InputMaybe<LastEvaluatedKey>) =>
              setPageVariables([...pageVariables, { after }])
            }
          />
        );
      })}
    </div>
  );
};
export default Questboard;
