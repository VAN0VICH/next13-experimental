"use client";
import styles from "./home.module.css";
// import { Accordion, Box, Checkbox } from "@mantine/core";
const Filters = () => {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filters}>
        <div className={styles.checkboxContainer}>
          <>
            <div className={styles.topicCheckboxContainer}></div>
          </>
        </div>
      </div>
    </div>
  );
};
export default Filters;
