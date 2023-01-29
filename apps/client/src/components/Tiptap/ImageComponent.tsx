"use client";
import { NodeViewWrapper } from "@tiptap/react";
import Image from "next/image";
import React from "react";
import styles from "./components.module.css";

export default (props) => {
  console.log("props", props);
  const imageLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };
  return (
    <NodeViewWrapper className={styles.imageParentContainer}>
      <div className={styles.imageContainer} draggable="true" data-drag-handle>
        <Image
          loader={imageLoader}
          src={props.node.attrs.src}
          // width={500}
          // height={300}
          priority
          alt="image"
          sizes="(max-width: 768px) 90vw, (min-width: 1024px) 500px"
          fill={true}
        />
      </div>
    </NodeViewWrapper>
  );
};
