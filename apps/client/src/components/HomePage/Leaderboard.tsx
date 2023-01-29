"use client";
import styles from "./home.module.css";

const Leaderboard = () => {
  return (
    <div className={styles.leaderboardContainer}>
      <div className={styles.leaderboard}>
        <div className={styles.leaderboardRoof}></div>
        <div className={styles.leaderboardTitleContainer}>
          <div className={styles.leaderboardBadge}>
            <h1 className="title1">Leaderboard</h1>
          </div>
        </div>
        <div className={styles.leaderboardButtonsContainer}>
          <button className={styles.leaderboardButton}></button>
          <button className={styles.leaderboardButton}></button>
          <button className={styles.leaderboardButton}></button>
          <button className={styles.leaderboardButton}></button>
        </div>
        <div className={styles.leadersContainer}>
          <div className={styles.leader}>
            <div className={styles.avatar}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Leaderboard;
