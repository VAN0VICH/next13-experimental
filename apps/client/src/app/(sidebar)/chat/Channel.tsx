"use client";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import React, { MutableRefObject } from "react";
import styles from "./chat.module.css";

const Channel = ({
  currentlyJoinedChannel,
  handleLeaveChannel,
  children,
  channelRef,
}: {
  currentlyJoinedChannel: GroupChannel | null;
  handleLeaveChannel: () => Promise<void>;
  children: React.ReactNode;
  channelRef: MutableRefObject<HTMLDivElement>;
}) => {
  if (currentlyJoinedChannel) {
    return (
      <div className={styles.channel} ref={channelRef}>
        <div className={styles.channelHeader}>
          {/* <div>{currentlyJoinedChannel.name}</div> */}
          yo
        </div>

        {children}
      </div>
    );
  }
  return <div className={styles.channel}></div>;
};
export default Channel;
