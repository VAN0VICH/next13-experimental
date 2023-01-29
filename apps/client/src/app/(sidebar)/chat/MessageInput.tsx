"use client";
import { ChangeEvent } from "react";
import { handleEnterPress } from "../../../utilities/messageUtils";
import styles from "./chat.module.css";

const MessageInput = ({
  value,
  onChange,
  sendMessage,
  onFileInputChange,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  sendMessage: () => Promise<void>;
  onFileInputChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
}) => {
  return (
    <div className={styles.channelInputContainer}>
      <div className={styles.messageInputContainer}>
        <input
          className={styles.messageInput}
          placeholder="write a message"
          value={value}
          onChange={onChange}
          onKeyDown={(event) => handleEnterPress(event, sendMessage)}
        />
      </div>

      <div className={styles.messageButtonsContainer}>
        <div className={styles.messageButtonContainer}>
          <button className={styles.sendMessageButton} onClick={sendMessage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="32"
              height="32"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                fill="rgba(255,255,255,1)"
              />
            </svg>
          </button>
        </div>

        <div className={styles.messageButtonContainer}>
          <label className={styles.fileUploadButton} htmlFor="upload">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="32"
              height="32"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M14.828 7.757l-5.656 5.657a1 1 0 1 0 1.414 1.414l5.657-5.656A3 3 0 1 0 12 4.929l-5.657 5.657a5 5 0 1 0 7.071 7.07L19.071 12l1.414 1.414-5.657 5.657a7 7 0 1 1-9.9-9.9l5.658-5.656a5 5 0 0 1 7.07 7.07L12 16.244A3 3 0 1 1 7.757 12l5.657-5.657 1.414 1.414z"
                fill="rgba(255,255,255,1)"
              />
            </svg>
          </label>
          <input
            id="upload"
            type="file"
            hidden={true}
            onChange={onFileInputChange}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
export default MessageInput;
