import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import {
  addUser,
  fetchAllUsers,
  fetchSpecifiedUser,
} from "~/server/db";
export const userRouter = createTRPCRouter({
  getAllUsers: publicProcedure.query(async () => {
    const usersDbArray = await fetchAllUsers();
    return { message: "All users have been fetched", data: usersDbArray };
  }),
  addUser: publicProcedure
    .input(z.object({id:z.string(), email: z.string(), password: z.string() }))
    .mutation(async (obj) => {
      await addUser({id:obj.input.id,email: obj.input.email, password: obj.input.password });
      return {
        message: `User added to database with email:${obj.input.email} and password:${obj.input.password}`,
      };
    }),
  getSpecifiedUser: publicProcedure.input(z.string()).query(async (arg) => {
    const specifiedUserFromDb = await fetchSpecifiedUser(arg.input);
    return { message: "User has been fetched", data: specifiedUserFromDb };
  }),
});
