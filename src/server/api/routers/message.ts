import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { addMessage, fetchMessages } from "~/server/db";

export const messageRouter = createTRPCRouter({
  getMessages: publicProcedure.input(z.number()).query(async (arg) => {
    const messagesFromDbArray = await fetchMessages(arg.input);
    return {
      message: "All messages have been fetched",
      data: messagesFromDbArray,
    };
  }),
  addMessage: publicProcedure
    .input(
      z.object({
        conv_id: z.number(),
        msg_content: z.string(),
        is_user_message: z.boolean(),
      }),
    )
    .mutation(async (arg) => {
      const messageAdditionResponse = await addMessage({
        conversation_id: arg.input.conv_id,
        content: arg.input.msg_content,
        is_user_message: arg.input.is_user_message,
      });
      if (messageAdditionResponse === -1) {
        return {
          message: "Message creation failed.",
        };
      }
      return {
        message: `Message added with the following content:${arg.input.msg_content}`,
      };
    }),
});
