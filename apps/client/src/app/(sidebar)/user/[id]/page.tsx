import { User } from "../../../../generated/graphql";
import { getUserById } from "../../../../serverFunctions/getUserById";
import { USER_ID } from "../../../../utilities/userId";
import styles from "./user.module.css";

const User = async ({ params }: { params: { id: string } }) => {
  // const user: User = await getUserById(params.id);
  const user: User = { id: USER_ID, level: 0, experience: 0, role: "User" };

  const array = [{}, {}];
  return (
    <div className={styles.parent}>
      <div className={styles.avatarAndGuildContainer}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}></div>
        </div>
        <div className={styles.guildContainer}>
          <div className={styles.guild}></div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.levelContainer}>
          <div className={styles.level}></div>
        </div>
        <div className={styles.aboutUserContainer}>
          <div className={styles.aboutUser}></div>
        </div>

        <div className={styles.topicsTitleContainer}>
          <div className={styles.topicsTitle}>Topics</div>
        </div>
        <div className={styles.topicsContainer}>
          <div className={styles.topics}></div>
        </div>

        <div className={styles.achievementsTitleContainer}>
          <div className={styles.achievementsTitle}>Achievements</div>
        </div>
        <div className={styles.achievementsContainer}>
          <div className={styles.achievements}></div>
        </div>
        <div className={styles.questsTitleContainer}>
          <div className={styles.questsTitle}>Quests</div>
        </div>
        <div className={styles.questsContainer}>
          <div className={styles.quests}></div>
        </div>
      </div>
    </div>
  );
};
export default User;
