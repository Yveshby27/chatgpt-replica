import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

import {
  addConversation,
  deleteConversation,
  getAllConversations,
} from "~/server/db";

export const conversationRouter = createTRPCRouter({
  addConversation: publicProcedure
    .input(z.object({ user_id: z.string(), date_created: z.string() }))
    .mutation(async (arg) => {
      const conversationAdditionResponse = await addConversation({
        user_id: arg.input.user_id,
        date_created: arg.input.date_created,
      });
      if (
        conversationAdditionResponse === -1 ||
        conversationAdditionResponse === undefined
      ) {
        return {
          message: "User not found. ",
        };
      }
      return {
        message: `Conversation created for the following user id:${arg.input.user_id} on this date:${arg.input.date_created}`,
        data: conversationAdditionResponse,
      };
    }),
  deleteConversation: publicProcedure
    .input(z.number())
    .mutation(async (arg) => {
      const conversationDeletionResponse = await deleteConversation(arg.input);
      if (conversationDeletionResponse === -1) {
        return {
          message: "No conversation found for deletion",
        };
      }
      return {
        message: `Deleted conversation with the following conversation id:${arg.input}`,
      };
    }),
  getAllConversations: publicProcedure.input(z.string()).query(async (arg) => {
    const conversationFetchingResponse = await getAllConversations(arg.input);
    if (
      conversationFetchingResponse === -1 ||
      conversationFetchingResponse === undefined
    )
      return {
        message: "Conversations not found",
      };
    return {
      message: "Conversations fetched successfully",
      data: conversationFetchingResponse,
    };
  }),
});
