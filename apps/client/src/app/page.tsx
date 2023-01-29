import styles from "./welcome.module.css";
const Welcome = () => {
  let signed = false;
  if (signed) {
    console.log("redirecting to home page");
  } else {
    return (
      <main className={styles.mainContainer}>
        <div className={styles.aboutContainer}></div>
        <div className={styles.loginContainer}></div>
      </main>
    );
  }
};

// export default withUrqlClient((ssrExchange) => ({
//   url: "http://localhost:4000/graphql",
// }))(Home);
export default Welcome;
