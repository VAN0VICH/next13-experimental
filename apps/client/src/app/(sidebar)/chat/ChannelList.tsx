"use client";
import { BaseChannel } from "@sendbird/chat";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import styles from "./chat.module.css";

const ChannelList = ({
  channels,
  handleJoinChannel,
  handleDeleteChannel,
  handleLoadMemberSelectionList,
}: {
  channels: GroupChannel[] | null;
  handleJoinChannel: (channelUrl: string) => Promise<void>;
  handleDeleteChannel: (channelUrl: string) => Promise<boolean>;
  handleLoadMemberSelectionList: () => Promise<void>;
}) => {
  return (
    <div className={styles.channelList}>
      <div className={styles.createChannelContainer}>
        <button
          className={styles.createChannelButton}
          onClick={() => handleLoadMemberSelectionList}
        >
          Create Channel
        </button>
      </div>

      {channels &&
        channels.map((channel) => {
          return (
            <div
              key={channel.url}
              className={styles.channelListItem}
              onClick={() => {
                handleJoinChannel(channel.url);
              }}
            >
              <div className={styles.avatarContainer}>
                <div className={styles.avatar}></div>
              </div>
              <div>
                {/* <ChannelName members={channel.members} /> */}
                <div>{channel.members[1].nickname}</div>
                <div>{channel.lastMessage?.data}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
// const ChannelName = ({ members }) => {
//   const membersToDisplay = members.slice(0, 2);
//   const membersNotToDisplay = members.slice(2);

//   return (
//     <>
//       {membersToDisplay.map((member) => {
//         return <span key={member.userId}>{member.nickname}</span>;
//       })}
//       {membersNotToDisplay.length > 0 && `+ ${membersNotToDisplay.length}`}
//     </>
//   );
// };
export default ChannelList;
