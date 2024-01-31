"use client";
import { ReactNode, createContext, useContext, useState } from "react";

interface Props {
  children: ReactNode;
}
export interface UserContextProps {
  messages: string[];
  setMessageArr(messages: string[]): void;
  currentConversationId: number;
  setCurrentConversation(conversation_id: number): void;
}

const UserContext = createContext<UserContextProps>({
  messages: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMessageArr(messages: string[]) {},
  currentConversationId: -1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentConversation(conversation_id: number) {},
});

export const UserContextProvider = ({ children }: Props) => {

  const [currentConversationId, setCurrentConversationId] = useState(-1);
  const [messages, setMessages] = useState<string[]>([]);

  const setMessageArr = (messages: string[]) => {
    setMessages(messages);
  };
  const setCurrentConversation = (convId: number) => {
    setCurrentConversationId(convId);
  };

  return (
    <>
      <UserContext.Provider
        value={{
        
          messages,
          setMessageArr,
          currentConversationId,
          setCurrentConversation,
        }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
};

export const useUserContext = () => useContext(UserContext);
