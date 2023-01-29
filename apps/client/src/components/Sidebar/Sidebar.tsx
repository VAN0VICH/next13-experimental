import Link from "next/link";
import React from "react";

import styles from "./sidebar.module.css";
const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.userAvatarContainer}>
        <div className={styles.userAvatar}></div>
      </div>
      <div className={styles.buttonContainer}>
        <Link href={"/quests"}>
          <button className={styles.button}>
            <h1 className="title1">Quests</h1>
          </button>
        </Link>
      </div>
      <div className={styles.buttonContainer}>
        <Link href={"/workspace"}>
          <button className={styles.button}>
            <h1 className="title1">My workspace</h1>
          </button>
        </Link>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button}>
          <h1 className="title1">Notifications</h1>
        </button>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button}>
          <h1 className="title1">Leaderboard</h1>
        </button>
      </div>
      <div className={styles.buttonContainer}>
        <Link href={"/chat"}>
          <button className={styles.button}>
            <h1 className="title1">Chat</h1>
          </button>
        </Link>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button}>
          <h1 className="title1">Forum</h1>
        </button>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button}>
          <h1 className="title1">Settings</h1>
        </button>
      </div>
      <div className={styles.logoutButtonContainer}>
        <button className={styles.logoutButton}>Logout</button>
      </div>
    </div>
  );
};
export default Sidebar;
