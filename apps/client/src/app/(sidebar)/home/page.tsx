import styles from "../../../components/HomePage/home.module.css";

import Leaderboard from "../../../components/HomePage/Leaderboard";
import Questboard from "../../../components/HomePage/Questboard";
import Filters from "../../../components/HomePage/Filters";
const Home = () => {
  return (
    <main className={styles.mainContainer}>
      <div className={styles.childrenContainer}>
        <div className={styles.content}>
          <Leaderboard />
          <Questboard />
          <Filters />
        </div>
      </div>
    </main>
  );
};

export default Home;
