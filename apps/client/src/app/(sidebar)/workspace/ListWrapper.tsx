"use client";
import styles from "./workspace.module.css";

import React from "react";

import { workspaceQuestAndSolutionListVersion } from "../../../serverFunctions/workplaceQuestAndSolutionListVersion";
import { USER_ID } from "../../../utilities/userId";
import dynamic from "next/dynamic";
const List = dynamic(() => import("./List"), {
  ssr: false,
});
const ListWrapper = () => {
  return (
    <>
      <List serverVersion={1} />
    </>
  );
};

export default ListWrapper;
