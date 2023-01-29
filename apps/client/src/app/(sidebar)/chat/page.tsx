"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./chat.module.css";
import SendbirdChat, {
  BaseChannel,
  SendbirdChatParams,
  User,
} from "@sendbird/chat";
import { BaseMessage, MessageModule } from "@sendbird/chat/message";
import {
  MessageCollection,
  MessageCollectionEventHandler,
  MessageCollectionInitPolicy,
  MessageCollectionInitResultHandler,
  GroupChannelFilter,
  GroupChannelListOrder,
  MessageFilter,
  GroupChannel,
  GroupChannelCollection,
  GroupChannelCollectionEventHandler,
  GroupChannelModule,
  SendbirdGroupChat,
  GroupChannelEventContext,
} from "@sendbird/chat/groupChannel";

import Channel from "./Channel";
import ChannelList from "./ChannelList";
import { USERNAME, USER_ID } from "../../../utilities/userId";
import { GeneralStore } from "../../../zustand/general";
import MessagesList from "./MessageList";
import MessageInput from "./MessageInput";
import { SendableMessage } from "@sendbird/chat/lib/__definition";
import Settings from "./Settings";
interface GroupChannelState {
  applicationUsers: User[] | undefined;
  groupChannelMembers: string[];
  currentlyJoinedChannel: GroupChannel | null;
  messages: BaseMessage[];
  channels: GroupChannel[] | null;
  messageInputValue: string;
  userNameInputValue: string;
  userIdInputValue: string;
  channelNameUpdateValue: string;
  settingUpUser: boolean;
  file: File | null;
  messageToUpdate: BaseMessage | null;
  messageCollection: MessageCollection | null;
  loading: boolean;
  errorMessage: string;
}
declare abstract class Module {
  readonly moduleSpecifier: "__module__";
  readonly name: string;
}
type ModuleNamespaces<T extends Module[], M extends T[number] = T[number]> = {
  [key in M["name"]]: M extends {
    name: key;
  }
    ? Omit<M, keyof Module>
    : never;
};

const Chat = () => {
  const isChatConnected = GeneralStore((state) => state.isChatConnected);
  const setChatConnected = GeneralStore((state) => state.setChatConnected);
  const [state, updateState] = useState<GroupChannelState>({
    applicationUsers: [],
    groupChannelMembers: [],
    currentlyJoinedChannel: null,
    messages: [],
    channels: [],
    messageInputValue: "",
    userNameInputValue: "",
    userIdInputValue: "",
    channelNameUpdateValue: "",
    settingUpUser: true,
    file: null,
    messageToUpdate: null,
    messageCollection: null,
    loading: false,
    errorMessage: "",
  });
  const params: SendbirdChatParams<[GroupChannelModule]> = {
    appId: process.env.NEXT_PUBLIC_SENDBIRD_APP_ID!,
    localCacheEnabled: true,
    modules: [new GroupChannelModule()],
  };
  const sendbirdChat = SendbirdChat.init(params) as SendbirdGroupChat;
  const stateRef = useRef<GroupChannelState>();
  stateRef.current = state;

  const channelRef = useRef<HTMLDivElement>();

  const scrollToBottom = ({
    item,
    behavior,
  }: {
    item: HTMLDivElement;
    behavior: ScrollBehavior;
  }) => {
    item?.scrollTo({
      top: item.scrollHeight,
      behavior: behavior,
    });
  };
  // useEffect(() => {
  //   if (!isChatConnected) {
  //     setupUser();
  //     setChatConnected();
  //   }
  // }, []);
  useEffect(() => {
    scrollToBottom({ item: channelRef.current!, behavior: "smooth" });
  }, [state.currentlyJoinedChannel]);

  useEffect(() => {
    scrollToBottom({ item: channelRef.current!, behavior: "smooth" });
  }, [state.messages]);
  const setupUser = async () => {
    try {
      updateState({ ...state, loading: true });
      await sendbirdChat.connect(USER_ID);

      await sendbirdChat.setChannelInvitationPreference(true);

      const channels = await loadChannels(channelHandlers);
      console.log("chanels", channels);

      updateState({
        ...state,
        channels: channels,
        loading: false,
        settingUpUser: false,
      });
    } catch (error) {
      console.log(error);

      onError("sendbird set up user Error");
      throw Error("sendbird set up user Error");
    }
  };
  const channelHandlers: GroupChannelCollectionEventHandler = {
    onChannelsAdded: (
      context: GroupChannelEventContext,
      channels: GroupChannel[]
    ) => {
      // let updatedChannels:BaseChannel[] | GroupChannel[] |null = nu
      if (!state.channels) {
        return;
      }
      const updatedChannels = [...channels, ...stateRef!.current!.channels!];
      updateState({
        ...stateRef!.current!,
        channels: updatedChannels,
        applicationUsers: [],
      });
    },
    onChannelsDeleted: (
      context: GroupChannelEventContext,
      channels: GroupChannel[]
    ) => {
      if (!state.channels) {
        return;
      }
      const updatedChannels = stateRef!.current!.channels!.filter((channel) => {
        return !channels.includes(channel.url);
      });
      updateState({ ...stateRef.current!, channels: updatedChannels });
    },
    onChannelsUpdated: (
      context: GroupChannelEventContext,
      channels: GroupChannel[]
    ) => {
      if (!state.channels) {
        return;
      }
      const updatedChannels = stateRef!.current!.channels!.map((channel) => {
        const updatedChannel = channels.find(
          (incomingChannel) => incomingChannel.url === channel.url
        );
        if (updatedChannel) {
          return updatedChannel;
        } else {
          return channel;
        }
      });

      updateState({ ...stateRef.current!, channels: updatedChannels });
    },
  };
  const onError = (errorMessage: string) => {
    updateState({ ...state, errorMessage });
    console.log(errorMessage);
  };

  const loadChannels = async (
    channelHandlers: GroupChannelCollectionEventHandler
  ) => {
    const groupChannelFilter = new GroupChannelFilter();
    groupChannelFilter.includeEmpty = true;

    const collection: GroupChannelCollection =
      sendbirdChat.groupChannel.createGroupChannelCollection({
        filter: groupChannelFilter,
        order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
      });

    collection.setGroupChannelCollectionHandler(channelHandlers);
    try {
      const channels = await collection.loadMore();

      return channels;
    } catch (error) {
      console.log(error);
      onError("load channel error");
      throw new Error("load channel error");
    }
  };
  const deleteChannel = async (channelUrl: string) => {
    try {
      const channel = await sendbirdChat.groupChannel.getChannel(channelUrl);
      await channel.delete();
      return { channel, errorMessage: null };
    } catch (error) {
      console.log(error);
      return { channel: null, errorMessage: "error deleting channel" };
    }
  };

  const handleDeleteChannel = async (channelUrl: string) => {
    const { channel, errorMessage } = await deleteChannel(channelUrl);
    if (errorMessage) {
      onError(errorMessage);
      return false;
    }
    return true;
  };

  const deleteMessage = async ({
    currentlyJoinedChannel,
    messageToDelete,
  }: {
    currentlyJoinedChannel: GroupChannel;
    messageToDelete: BaseMessage;
  }) => {
    await currentlyJoinedChannel.deleteMessage(messageToDelete);
  };
  const getAllApplicationUsers = async () => {
    try {
      const userQuery = sendbirdChat.createApplicationUserListQuery({
        limit: 100,
      });
      const users = await userQuery.next();
      return { users, errorMessage: null };
    } catch (error) {
      console.log(error);

      return { users: null, errorMessage: "Get application users error" };
    }
  };
  const createChannel = async (
    channelName: string,
    userIdsToInvite: string[]
  ) => {
    try {
      const groupChannelParams = {
        invitedUserIds: userIdsToInvite,
        name: channelName,
        operatorUserIds: userIdsToInvite,
      };

      const groupChannel = await sendbirdChat.groupChannel.createChannel(
        groupChannelParams
      );
      return { groupChannel, errorMessage: null };
    } catch (error) {
      console.log(error);
      return {
        groupChannel: null,
        errorMessage: "Error in creating a channel",
      };
    }
  };

  const handleCreateChannel = async (channelName: string) => {
    const { groupChannel, errorMessage } = await createChannel(
      channelName,
      state.groupChannelMembers
    );
    if (errorMessage) {
      return onError(errorMessage);
    }
  };
  const handleJoinChannel = async (channelUrl: string) => {
    if (state.messageCollection && state.messageCollection.dispose) {
      state.messageCollection?.dispose();
    }

    if (state.currentlyJoinedChannel?.url === channelUrl) {
      return;
    }
    const { channels } = state;
    updateState({ ...state, loading: true });
    if (!channels) {
      return;
    }
    const channel = channels.find(
      (channel) => channel.url === channelUrl
    ) as GroupChannel;
    const onCacheResult: MessageCollectionInitResultHandler = (
      err,
      messages
    ) => {
      updateState({
        ...stateRef.current!,
        currentlyJoinedChannel: channel,
        messages: messages.reverse(),
        loading: false,
      });
    };

    const onApiResult: MessageCollectionInitResultHandler = (err, messages) => {
      updateState({
        ...stateRef.current!,
        currentlyJoinedChannel: channel,
        messages: messages.reverse(),
        loading: false,
      });
    };

    const collection = loadMessages({
      channel,
      messageHandlers,
      onCacheResult,
      onApiResult,
    });

    updateState({ ...state, messageCollection: collection });
  };
  const handleLeaveChannel = async () => {
    const { currentlyJoinedChannel } = state;
    if (!currentlyJoinedChannel) {
      return;
    }
    await currentlyJoinedChannel.leave();

    updateState({ ...state, currentlyJoinedChannel: null });
  };
  const handleDeleteMessage = async (messageToDelete: BaseMessage) => {
    const { currentlyJoinedChannel } = state;
    if (!currentlyJoinedChannel) {
      return;
    }
    await deleteMessage({ currentlyJoinedChannel, messageToDelete }); // Delete
  };
  const handleLoadMemberSelectionList = async () => {
    updateState({ ...state, currentlyJoinedChannel: null });
    const { users, errorMessage } = await getAllApplicationUsers();
    if (errorMessage) {
      return onError(errorMessage);
    }
    if (!users) {
      return;
    }
    updateState({
      ...state,
      currentlyJoinedChannel: null,
      applicationUsers: users,
      groupChannelMembers: [sendbirdChat.currentUser.userId],
    });
  };
  const messageHandlers: MessageCollectionEventHandler = {
    onMessagesAdded: (context, channel, messages) => {
      const updatedMessages = [...stateRef.current!.messages, ...messages];

      updateState({ ...stateRef.current!, messages: updatedMessages });
    },
    onMessagesUpdated: (context, channel, messages) => {
      const updatedMessages = [...stateRef.current!.messages];
      for (let i in messages) {
        const incomingMessage = messages[i];
        const indexOfExisting = stateRef.current!.messages.findIndex(
          (message) => {
            return incomingMessage.reqId === message.reqId;

            // return incomingMessage.messageId === message.messageId;
          }
        );

        if (indexOfExisting !== -1) {
          updatedMessages[indexOfExisting] = incomingMessage;
        }
        if (!incomingMessage.reqId) {
          // if (!incomingMessage.messageId) {
          updatedMessages.push(incomingMessage);
        }
      }

      updateState({ ...stateRef.current!, messages: updatedMessages });
    },
    onMessagesDeleted: (context, channel, messageIds) => {
      const updateMessages = stateRef.current!.messages.filter((message) => {
        return !messageIds.includes(message.messageId);
      });
      updateState({ ...stateRef.current!, messages: updateMessages });
    },
    onChannelUpdated: (context, channel) => {},
    onChannelDeleted: (context, channelUrl) => {},
    onHugeGapDetected: () => {},
  };
  const loadMessages = ({
    channel,
    messageHandlers,
    onCacheResult,
    onApiResult,
  }: {
    channel: GroupChannel;
    messageHandlers: MessageCollectionEventHandler;
    onCacheResult: MessageCollectionInitResultHandler;
    onApiResult: MessageCollectionInitResultHandler;
  }) => {
    const messageFilter = new MessageFilter();

    const collection = channel.createMessageCollection({
      filter: messageFilter,
      startingPoint: Date.now(),
      limit: 100,
    });

    collection.setMessageCollectionHandler(messageHandlers);
    collection
      .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
      .onCacheResult(onCacheResult)
      .onApiResult(onApiResult);
    return collection;
  };
  const sendMessage = async () => {
    const { messageToUpdate, currentlyJoinedChannel, messages } = state;
    if (messageToUpdate) {
      const userMessageUpdateParams = { message: state.messageInputValue };
      if (!currentlyJoinedChannel) {
        return;
      }
      const updatedMessage = await currentlyJoinedChannel.updateUserMessage(
        messageToUpdate.messageId,
        userMessageUpdateParams
      );
      const messageIndex = messages.findIndex(
        (item) => item.messageId == messageToUpdate.messageId
      );
      messages[messageIndex] = updatedMessage;
      updateState({
        ...state,
        messages: messages,
        messageInputValue: "",
        messageToUpdate: null,
      });
    } else {
      const userMessageParams = { message: state.messageInputValue };
      if (!currentlyJoinedChannel) {
        return;
      }
      currentlyJoinedChannel
        .sendUserMessage(userMessageParams)
        .onSucceeded((message) => {
          updateState({ ...stateRef.current!, messageInputValue: "" });
        })
        .onFailed((error) => {
          console.log(error);
          console.log("failed");
        });
    }
  };
  const updateMessage = async (message: BaseMessage) => {
    updateState({
      ...state,
      messageToUpdate: message,
      messageInputValue: message.message,
    });
  };
  const onMessageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const messageInputValue = e.currentTarget.value;
    updateState({ ...state, messageInputValue });
  };
  const onFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const { currentlyJoinedChannel, messages } = state;
      const fileMessageParams = { file: e.currentTarget.files[0] };
      if (!currentlyJoinedChannel) {
        return;
      }

      currentlyJoinedChannel
        .sendFileMessage(fileMessageParams)
        .onSucceeded((message) => {
          updateState({
            ...stateRef.current!,
            messageInputValue: "",
            file: null,
          });
        })
        .onFailed((error) => {
          console.log(error);
          console.log("failed");
        });
    }
  };

  return (
    <div className={styles.parent}>
      <div className={styles.chatContainer}>
        <div className={styles.sidebar}>
          <div className={styles.searchContainer}>
            <button onClick={setupUser}>yoooooo</button>
          </div>

          <div className={styles.channelListContainer}>
            <ChannelList
              channels={state.channels}
              handleDeleteChannel={handleDeleteChannel}
              handleJoinChannel={handleJoinChannel}
              handleLoadMemberSelectionList={handleLoadMemberSelectionList}
            />
          </div>
        </div>
        <div className={styles.channelContainer}>
          <Channel
            channelRef={channelRef}
            currentlyJoinedChannel={state.currentlyJoinedChannel}
            handleLeaveChannel={handleLeaveChannel}
          >
            <div className={styles.dialogContainer}>
              <div className={styles.dialog}>
                <MessagesList
                  handleDeleteMessage={handleDeleteMessage}
                  messages={state.messages}
                  sb={sendbirdChat}
                  updateMessage={updateMessage}
                />
                <MessageInput
                  onChange={onMessageInputChange}
                  onFileInputChange={onFileInputChange}
                  sendMessage={sendMessage}
                  value={state.messageInputValue}
                />
              </div>
              <Settings />
            </div>
          </Channel>
        </div>
      </div>
    </div>
  );
};
export default Chat;
