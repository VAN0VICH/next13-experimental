"use client";
import { useRouter } from "next/navigation";
import { useCreateQuestMutation } from "../../../generated/graphql";
import styles from "./workspace.module.css";
import { withUrqlClient } from "next-urql";
import { USER_ID } from "../../../utilities/userId";
import { serverUrl } from "../../../utilities/constants";
import ActionComponent from "./ActionComponent";
const Workspace = () => {
  return (
    <>
      <div className="centerDiv">
        <h1 className="title1">Actions</h1>
      </div>

      <ActionComponent pageProps={""} />
    </>
  );
};

export default Workspace;
