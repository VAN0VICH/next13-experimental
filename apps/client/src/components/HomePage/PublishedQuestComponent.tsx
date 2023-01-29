"use client";
import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { InputMaybe, LastEvaluatedKey, Quest } from "../../generated/graphql";
import styles from "./home.module.css";
type Props = {
  variables: {
    after: InputMaybe<LastEvaluatedKey>;
  };
  onLoadMore: (after: InputMaybe<LastEvaluatedKey>) => void;
  isLastPage: boolean;
};
const LoaderComponent = () => {
  return (
    <div className="centerDiv">
      <div className={styles.questComponents}>Loading...</div>
    </div>
  );
};
//to be deleted
const quest: Quest = {
  id: "ivanthegreatest",
  creatorId: "5d9792d7-428e-459b-943d-a97c2cbf99ed",
  description:
    "Hey, i am noob and i dont know data structures. Can someone reverse the binary tree for 0.0069420 BTC",
  title: "How to reverse a binary tree",
  topic: "programming",
  subtopic: "Data Structures",
  reward: 100,
  slots: 5,
};
const quests: Quest[] = [quest];
// for (let i = 0; i < 10; i++) {
//   const _quest: Quest = {
//     id: uuidv4(),
//     creatorId: "user#1",
//     title: "How to reverse a binary tree",
//     topic: "programming",
//     subtopic: "Data Structures",
//     reward: 100,
//     slots: 5,
//   };
//   quests.push(_quest);
// }

//to be deleted
const PublishedQuestComponent = ({
  variables,
  onLoadMore,
  isLastPage,
}: Props) => {
  const { ref, inView } = useInView();
  const data = { publishedQuests: { nodes: quests } };

  // const [{ data, fetching }] = usePublishedQuestsQuery({
  //   variables,
  // });
  // useEffect(() => {
  //   if (inView) {
  //     onLoadMore(data?.publishedQuests?.pageInfo?.endCursor!);
  //   }
  // }, [inView]);
  // console.log("quests data", data);
  // if (fetching) {
  //   return <LoaderComponent />;
  // }

  return (
    <div className="centerDiv">
      <div className={styles.questsList}>
        {!data ? (
          <div>NO data found</div>
        ) : (
          data?.publishedQuests?.nodes!.map((node) => (
            <div className={styles.questComponent} key={node.id}>
              <div className={styles.questComponentHeader}>
                <div className={styles.screwComponent}>
                  <div className={styles.relative}>
                    <div className={styles.screw}></div>
                    <div className={styles.hole}></div>
                  </div>
                </div>
                <div className={styles.screwComponent}>
                  <div className={styles.relative}>
                    <div className={styles.screw}></div>
                    <div className={styles.hole}></div>
                  </div>
                </div>
              </div>
              <div className={styles.board} key={node?.id}>
                <div className={styles.questContent}>
                  <div className={styles.questContentPadding}>
                    <Link href={`/quests/${node!.id}`}>
                      <div className={styles.userInfoContainer}>
                        <div className={styles.userAvatar}></div>
                        <div>
                          <div>level 1</div>
                          <div>Username</div>
                        </div>
                      </div>
                      <div className={styles.questTitleContainer}>
                        <div className="title1">{node.title}</div>
                      </div>
                      <div className={styles.topicContainer}>
                        <div className={styles.topic}>Marketing</div>
                        <div className={styles.subtopic}>Social media</div>
                      </div>
                      <div className={styles.descriptionContainer}>
                        <h5>{node.description}</h5>
                      </div>
                      <div className={styles.questDetailsContainer}></div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* {isLastPage && data?.publishedQuests?.pageInfo!.hasNextPage && (
          <button
            ref={ref}
            disabled={!data.publishedQuests.pageInfo.hasNextPage || fetching}
            className="button"
            onClick={() =>
              onLoadMore(data.publishedQuests?.pageInfo?.endCursor!)
            }
          >
            LoadMore
          </button>
        )} */}
      </div>
    </div>
  );
};
export default withUrqlClient((ssr) => ({
  url: "http://localhost:4000/graphql",
}))(PublishedQuestComponent);
