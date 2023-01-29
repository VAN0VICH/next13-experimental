import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "../../components/Sidebar/sidebar.module.css";

interface WrapperProps {
  children: React.ReactNode;
}

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className={styles.mainContainer}>
        <Sidebar />
        <div className={styles.childrenContainer}>{children}</div>
      </main>
    </>
  );
};
export default SidebarLayout;
