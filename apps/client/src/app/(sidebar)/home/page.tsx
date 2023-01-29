import styles from "../../../components/HomePage/home.module.css";

import Leaderboard from "../../../components/HomePage/Leaderboard";
import Questboard from "../../../components/HomePage/Questboard";
import Filters from "../../../components/HomePage/Filters";
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
