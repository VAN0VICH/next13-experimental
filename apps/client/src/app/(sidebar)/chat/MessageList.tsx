"use client";
import { User } from "@sendbird/chat";
import { SendbirdGroupChat } from "@sendbird/chat/groupChannel";
import { BaseMessage } from "@sendbird/chat/message";
import Message from "./Message";
import styles from "./chat.module.css";
import { SendableMessage } from "@sendbird/chat/lib/__definition";
const MessagesList = ({
  messages,
  handleDeleteMessage,
  updateMessage,
  sb,
}: {
  messages: SendableMessage[];
  handleDeleteMessage: (messageToDelete: BaseMessage) => Promise<void>;
  updateMessage: (message: BaseMessage) => Promise<void>;
  sb: SendbirdGroupChat;
}) => {
  return (
    <div className={styles.messageList}>
      {messages.map((message) => {
        if (!message.sender) return null;
        const messageSentByYou =
          message.sender.userId === sb.currentUser.userId;
        return (
          <div
            key={message.messageId}
            className={
              messageSentByYou ? styles.messageItemFromYou : styles.messageItem
            }
          >
            <ProfileImage user={message.sender} />
            <Message
              message={message}
              handleDeleteMessage={handleDeleteMessage}
              updateMessage={updateMessage}
              messageSentByYou={messageSentByYou}
              sb={sb}
            />
          </div>
        );
      })}
    </div>
  );
};
const ProfileImage = ({ user }: { user: User }) => {
  if (user.plainProfileUrl) {
    return (
      <div className={styles.profileImage}>
        <img src={user.plainProfileUrl} />
      </div>
    );
  } else {
    return (
      <div className={styles.profileImageContainer}>
        <div className={styles.profileImage}>{user.nickname.charAt(0)}</div>
      </div>
    );
  }
};
export default MessagesList;
