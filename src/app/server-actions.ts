"use server";
import { api } from "~/trpc/server";
import {
  type UserAddInfo,
  type MessageAddInfo,
  type ConversationAddInfo,
} from "~/server/db";

export const createUser = async ({id, email, password }: UserAddInfo) => {
  await api.user.addUser.mutate({
    id,
    email,
    password,
  });
};

export const getAllUsers = async () => {
  const allUsers = (await api.user.getAllUsers.query()).data;
  if (allUsers === undefined) return;
  return allUsers;
};

export const getSpecifiedUser = async (userEmail: string) => {
  const specifiedUser = (await api.user.getSpecifiedUser.query(userEmail)).data;
  return specifiedUser;
};

export const handleAddMessage = async ({
  conversation_id,
  content,
  is_user_message,
}: MessageAddInfo) => {
  await api.message.addMessage.mutate({
    conv_id: conversation_id,
    msg_content: content,
    is_user_message,
  });
};

export const handleGetMessages = async (conversation_id: number) => {
  const allMessages = (await api.message.getMessages.query(conversation_id))
    .data;
  return allMessages;
};

export const handleAddConversation = async ({
  user_id,
  date_created,
}: ConversationAddInfo) => {
  const newConversationId = await api.conversation.addConversation.mutate({
    user_id,
    date_created,
  });
  return newConversationId.data;
};

export const handleGetAllConversations = async (user_id: string) => {
  const allConversations =
    await api.conversation.getAllConversations.query(user_id);
  console.log(allConversations.data);
  return allConversations.data;
};

export const handleDeleteConversation = async (conversation_id: number) => {
  await api.conversation.deleteConversation.mutate(conversation_id);
};
