import styles from "./home.module.css";

import Leaderboard from "./Leaderboard";
import Questboard from "./Questboard";
import Filters from "./Filters";
const Home = () => {
  return (
    <div className={styles.parent}>
      <div className={styles.children}>
        <div className={styles.pageTitleContainer}>
          <h1 className={styles.title1}>Studlancer</h1>
        </div>
        <div className={styles.content}>
          <Leaderboard />
          <Questboard />
          <Filters />
        </div>
      </div>
    </div>
  );
};

export default Home;
