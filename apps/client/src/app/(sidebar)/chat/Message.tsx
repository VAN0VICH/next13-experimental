"use client";
import { SendableMessage } from "@sendbird/chat/lib/__definition";
import { BaseMessage } from "@sendbird/chat/message";
import { timestampToTime } from "../../../utilities/messageUtils";
import styles from "./chat.module.css";

import { SendbirdGroupChat } from "@sendbird/chat/groupChannel";
const Message = ({
  message,
  updateMessage,
  handleDeleteMessage,

  sb,

  messageSentByYou,
}: {
  message: BaseMessage;
  handleDeleteMessage: (messageToDelete: BaseMessage) => Promise<void>;
  updateMessage: (message: BaseMessage) => Promise<void>;

  sb: SendbirdGroupChat;
  messageSentByYou: boolean;
}) => {
  const messageSentByCurrentUser =
    message.sender.userId === sb.currentUser.userId;
  if (message.url) {
    return (
      <div
        className={
          messageSentByYou
            ? styles.messageContainerFromYou
            : styles.messageContainer
        }
      >
        <div className={styles.message}>
          <div className={styles.messageInfoContainer}>
            <div className={styles.messageSenderName}>
              {message.sender.nickname}
            </div>
            <div>{timestampToTime(message.createdAt)}</div>

            {/* <img src={message.url} /> */}

            {messageSentByCurrentUser && (
              <div>
                <button
                  className="control-button"
                  onClick={() => updateMessage(message)}
                ></button>
                <button
                  className="control-button"
                  onClick={() => handleDeleteMessage(message)}
                ></button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        messageSentByYou
          ? styles.messageContainerFromYou
          : styles.messageContainer
      }
    >
      <div className={styles.message}>
        <div className={styles.messageInfoContainer}>
          <div className={styles.messageSenderName}>
            {message.sender.nickname}
          </div>
          <div>{timestampToTime(message.createdAt)}</div>

          {messageSentByCurrentUser && (
            <div>
              <button
                className="control-button"
                onClick={() => updateMessage(message)}
              ></button>
              <button
                className="control-button"
                onClick={() => handleDeleteMessage(message)}
              ></button>
            </div>
          )}
        </div>
        {message.message}
      </div>
    </div>
  );
};
export default Message;
