"use client";
import { NodeViewWrapper } from "@tiptap/react";
import React from "react";
import styles from "./components.module.css";

export default (props) => {
  return (
    <NodeViewWrapper className="react-component">
      <div className={styles.fileContainer} draggable="true" data-drag-handle>
        <a href={props.node.attrs.link}>{props.node.attrs.src}</a>
        <button
          className={styles.deleteFileButton}
          onClick={() => {
            console.log("clicked");
            props.deleteNode(props.node);
          }}
        >
          X
        </button>
      </div>
    </NodeViewWrapper>
  );
};
