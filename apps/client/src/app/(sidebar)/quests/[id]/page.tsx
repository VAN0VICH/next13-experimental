"use client";
import { withUrqlClient } from "next-urql";
import { Quest, usePublishedQuestQuery } from "../../../../generated/graphql";
import { getPublishedQuestById } from "../../../../serverFunctions/getPublishedQuest";
import { getTestQuestById } from "../../../../serverFunctions/getTestQuest";
import styles from "./Quest.module.css";

/***** This page can be on the server. But beacause of a bug I will use client ****/

const PublishedQuest = ({ params }: { params: { id: string } }) => {
  console.log("id", params.id);
  const [data] = usePublishedQuestQuery({ variables: { id: params.id } });
  if (!data || !data.data?.publishedQuest) {
    return <div>no data</div>;
  }
  const quest = data.data?.publishedQuest;
  // const quest = (await getPublishedQuestById(params.id)) as Quest;
  console.log("here is the quest", quest);
  let array: {}[] = [];
  for (let i = 0; i < 5; i++) {
    array.push({});
  }

  return (
    <div className="centerDiv">
      <div className="side-margins">
        <div className={styles.questPage}>
          <div className={styles.questContainer}>
            <div className={styles.questComponent}>
              <div className="margin-left-20">
                <div className={styles.titleContainer}>
                  <h1 className="font-large">{quest.title}</h1>
                </div>

                <div className={styles.topicContainer}>
                  <div className={styles.topic}>{quest.topic}</div>
                  <div className={styles.subtopic}>{quest.subtopic}</div>
                </div>

                <div className={styles.rewardContainer}>
                  <div className={styles.yellowCircle}></div>
                  <div className={styles.amount}>{quest.reward}</div>
                </div>

                <div className={styles.descriptionContainer}>
                  <h1 className="font-large">Description</h1>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.customerContainer}>
            <div>
              <div className={styles.customerComponent}></div>
              <div className="flex-justify-center">
                <button className={styles.sendMessageButton}>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.participateButtonContainer}>
          <button className="button">Participate!</button>
        </div>
        <div className={styles.solversContainer}>
          <h1 className="font-medium">Current solvers</h1>
          <div className={styles.grid}>
            {array.map((a) => (
              <div className={styles.solver}>
                <div className={styles.greyCircle}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// export default PublishedQuest;
export default withUrqlClient((ssr) => ({
  url: "http:///localhost:4000/graphql",
}))(PublishedQuest);
