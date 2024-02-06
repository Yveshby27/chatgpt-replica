import { Sequelize, DataTypes } from "sequelize";
import pg from "pg";

const sequelize = new Sequelize(
  `${process.env.DATABASE_URL}`,
  {
    dialectModule: pg,
  },
);


const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
//sequelize.close() to close the connection

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { tableName: "User", freezeTableName: true },
);

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
    },
    is_user_message: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Conversation",
        
        key: "id",
      },
    },
  },
  { tableName: "Message", freezeTableName: true },
);

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date_created: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
  },
  { tableName: "Conversation", freezeTableName: true },
);

User.hasMany(Conversation, { foreignKey: "user_id" });
Conversation.belongsTo(User, { foreignKey: "user_id" });
Conversation.hasMany(Message, { foreignKey: "conversation_id" });
Message.belongsTo(Conversation, { foreignKey: "conversation_id" });

export interface UserAddInfo {
  id:string,
  email: string;
  password: string;
}
export const addUser = async ({ id,email, password }: UserAddInfo) => {
  try {
    await User.sync();
    const newUser = await User.create({id, email, password });
    console.log("User added:", newUser);
    return newUser;
  } catch (error) {
    console.log("An error occured while adding user:", error);
  }
};

export const fetchAllUsers = async () => {
  try {
    await User.sync();
    const allUsers = await User.findAll();

    const userArr: string[] = [];

    allUsers.map((user: { dataValues: { email: string } }) =>
      userArr.push(user.dataValues.email),
    );
    console.log("User array:", userArr);
    return userArr;
  } catch (error) {
    console.log("An error occured while fetching users:", error);
  }
};
export interface UserGetInfo {
  id: string;
  email: string;
  password: string;
}
export const fetchSpecifiedUser = async (userId: string) => {
  try {
    await User.sync();
    const specifiedUser = await User.findOne({ where: {id:userId } });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const specifiedUserEmail: string = specifiedUser?.dataValues.email as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const specifiedUserPassword: string = specifiedUser?.dataValues.password as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const specifiedUserId: string = specifiedUser?.dataValues.id as string;
    const specifiedUserAddInfo: UserGetInfo = {
      id: specifiedUserId,
      email: specifiedUserEmail,
      password: specifiedUserPassword,
    };

    return specifiedUserAddInfo;
  } catch (error) {
    console.log("An error occured while fetching user:", error);
  }
};
export interface ConversationAddInfo {
  user_id: string;
  date_created: string;
}

export const addConversation = async ({
  user_id,
  date_created,
}: ConversationAddInfo) => {
  try {

    await Conversation.sync();

    const user = await User.findOne({ where: { id: user_id } });
console.log('USER TO BE FOUND IS:',user_id)
console.log('USER FOUND IS:',user)
    if (user === null)  {
      console.log("User not found. Conversation not created.");
      console.log('ALL USERS:',fetchAllUsers())
      return -1;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const newConversation = await Conversation.create({  user_id: user.dataValues.id as string,
      date_created,
    });
    newConversation.set(user);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const newConversationId: number = newConversation.dataValues.id as number;
    console.log("New conversation created:", newConversationId);
    return newConversationId;
  } catch (error) {
    console.log("An error occurred while creating conversation:", error);
  }
};

export const deleteConversation = async (conversation_id: number) => {
  try {
    await Conversation.sync();
    const deletedConversation = await Conversation.destroy({
      where: { id: conversation_id },
    });
    if (deletedConversation <= 0) {
      console.log("No conversation found for deletion");
      return -1;
    }
    console.log("Conversation deleted");
  } catch (error) {
    console.log("an error occured while deleting conversation:", error);
  }
};

export interface ConversationGetInfo {
  user_id: string;
  conversation_id: number;
  date_created: string;
}
export const getAllConversations = async (user_id: string) => {
  try {
    const allConversations = await Conversation.findAll({ where: { user_id } });
    if (allConversations === undefined) return -1;

    const conversationArr: ConversationGetInfo[] = [];
    allConversations.map(
      (conversation: {
        dataValues: { user_id: string; id: number; date_created: string };
      }) =>
        conversationArr.push({
          user_id: conversation.dataValues.user_id,
          conversation_id: conversation.dataValues.id,
          date_created: conversation.dataValues.date_created,
        }),
    );
    return conversationArr;
  } catch (error) {
    console.log("an error occured getting all conversations:", error);
  }
};


export interface MessageAddInfo {
  conversation_id: number;
  content: string;
  is_user_message: boolean;
}

export const addMessage = async ({
  conversation_id,
  content,
  is_user_message,
}: MessageAddInfo) => {
  try {
    await Message.sync();
    const conversation = await Conversation.findOne({
      where: { id: conversation_id },
    });
    if (!conversation) {
      console.log("Conversation not found.");
      return -1;
    }
    const newMessage = await Message.create({
      content,
      is_user_message,
      conversation_id,
    });
    newMessage.set(conversation);
    console.log("Message added:", newMessage);
  } catch (error) {
    console.log("An error occured while creating message:", error);
  }
};

export const fetchMessages = async (conversation_id: number) => {
  try {
    await Message.sync();
    const messages = await Message.findAll({ where: { conversation_id } });
    const messagesArray: string[] = [];
    messages.map((message: { dataValues: { content: string } }) =>
      messagesArray.push(message.dataValues.content),
    );
    console.log("Message Array:", messagesArray);
    return messagesArray;
  } catch (error) {
    console.log("An error occured while fetching messages:", error);
  }
};
